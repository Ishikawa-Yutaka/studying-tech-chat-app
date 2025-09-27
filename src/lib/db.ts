import { prisma } from '@/lib/prisma';
// 型
import { User, ChannelType, Channel, Message, AiChatRecord } from '@/types/workspace';

/**
 * ユーザー関連の操作
 */
export const userOperations = {
  // ユーザーを作成
  async createUser(authId: string, email: string, name: string): Promise<User> {
    return prisma.user.create({ data: { authId, email, name } });
  },

  // 自分以外の全てのユーザーを取得 （セキュリティのために、メールアドレスは含めず id, name のみ取得する）
  async getAllUsersWithoutMe(userId: string): Promise<User[]> {
    return prisma.user.findMany({
      select: { id: true, name: true },
      where: { id: { not: userId } },
    });
  },

  // 認証 ID からユーザーを取得
  async getUserByAuthId(authId: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { authId } });
  },
};

/**
 * チャンネル関連の操作
 */
export const channelOperations = {
  // ユーザーが参加しているチャンネルを取得
  async getChannelsByUserId(userId: string): Promise<Channel[]> {
    return prisma.channel
      .findMany({
        where: { members: { some: { userId } } },
        // チャンネルのメンバーを、リレーションを辿って取得する
        include: { members: { include: { user: true } } },
      })
      .then((channels) => {
        return channels.map((channel) => ({
          id: channel.id,
          name: channel.name ?? '',
          description: channel.description ?? '',
          channelType: channel.type as ChannelType,
          // 自分以外のユーザーのメールアドレスは含めないように注意
          // メンバーのユーザー情報を取得 (そのまま member.id とすると、中間テーブルのレコードの id が取得されるので注意)
          members: channel.members.map((member) => ({
            id: member.user.id,
            name: member.user.name,
          })),
        }));
      });
  },

  // ID からチャンネルを取得
  async getChannelById(channelId: string): Promise<Channel | null> {
    return prisma.channel
      .findUnique({
        where: { id: channelId },
        include: { members: { include: { user: true } } },
      })
      .then((channel) => {
        if (!channel) return null;

        return {
          id: channel.id,
          name: channel.name ?? '',
          description: channel.description ?? '',
          channelType: channel.type as ChannelType,
          members: channel.members.map((member) => ({
            id: member.user.id,
            name: member.user.name,
          })),
        };
      });
  },

  // チャンネルを作成
  async createChannel(
    name: string | undefined,
    description: string | undefined,
    type: ChannelType,
    creatorUserId: string,
    otherUserId?: string
  ): Promise<Channel> {
    const channel = await prisma.channel.create({
      data: {
        name: type === ChannelType.CHANNEL ? name : null,
        description: type === ChannelType.CHANNEL ? description : null,
        type: type,
        members: {
          create:
            type === ChannelType.DM && otherUserId
              ? [{ userId: creatorUserId }, { userId: otherUserId }]
              : { userId: creatorUserId },
        },
      },
      include: { members: { include: { user: true } } },
    });

    return {
      id: channel.id,
      name: channel.name ?? '',
      description: channel.description ?? '',
      channelType: channel.type as ChannelType,
      members: channel.members.map((member) => ({
        id: member.user.id,
        name: member.user.name,
      })),
    };
  },
};

/**
 * DM において、相手のユーザーを取得する
 */
export function getDirectMessagePartner(channel: Channel, myUserId: string): User {
  if (channel.channelType !== ChannelType.DM) throw new Error('チャンネルが DM ではありません');
  const otherUser = channel.members.find((user) => user.id !== myUserId);
  if (!otherUser) throw new Error('ユーザーが見つかりませんでした');

  return { id: otherUser.id, name: otherUser.name };
}

/**
 * メッセージ関連の操作
 */
export const messageOperations = {
  // チャンネル ID からメッセージを取得 （そのチャンネルのメッセージ）
  async getMessagesByChannelId(channelId: string): Promise<Message[]> {
    const messages = await prisma.message.findMany({
      where: { channelId },
      include: { sender: true, channel: true },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map((message) => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      sender: { id: message.sender.id, name: message.sender.name },
      channelId: message.channel.id,
    }));
  },

  // ユーザー ID からメッセージを取得 （そのユーザーが送信したメッセージ）
  async getMessagesBySenderId(senderId: string): Promise<Message[]> {
    const messages = await prisma.message.findMany({
      where: { senderId },
      include: { sender: true, channel: true },
      orderBy: { createdAt: 'desc' },
    });

    return messages.map((message) => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      sender: { id: message.sender.id, name: message.sender.name },
      channelId: message.channel.id,
    }));
  },

  // メッセージを作成
  async createMessage(channelId: string, senderId: string, content: string): Promise<Message> {
    const message = await prisma.message.create({
      data: { channelId, senderId, content },
      include: { sender: true, channel: true },
    });

    return {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      sender: { id: message.sender.id, name: message.sender.name },
      channelId: message.channel.id,
    };
  },
};

// 1 日の最大使用回数
export const AI_CHAT_DAILY_USAGE_LIMIT = 3;

/**
 * AI チャット関連の操作
 */
export const aiChatOperations = {
  // 今日の AI チャット使用回数を確認する
  async getTodayUsageCount(userId: string): Promise<number> {
    // 今日の 0 時 0 分 0 秒に設定
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 該当のユーザー ID の、今日以降に作成されたデータを取得
    return prisma.aiChat.count({
      where: { userId, createdAt: { gte: today } },
    });
  },

  // 残りの使用可能回数を計算する
  async getRemainingUsage(userId: string): Promise<number> {
    const usageCount = await this.getTodayUsageCount(userId);

    // 1 日の最大使用回数から現在の使用回数を引いて、残り回数を計算
    return Math.max(0, AI_CHAT_DAILY_USAGE_LIMIT - usageCount);
  },

  /**
   * AI チャットの新しい会話を保存する
   * @param userId ユーザー ID
   * @param message ユーザーのメッセージ
   * @param response AI の応答
   * @returns 保存されたレコード
   */
  async saveConversation(userId: string, message: string, response: string): Promise<AiChatRecord> {
    return prisma.aiChat.create({ data: { userId, message, response } });
  },

  /**
   * ユーザーの会話履歴を取得する
   * @param userId ユーザーID
   * @param limit 取得する最大件数 (デフォルト: 50)
   * @returns 会話履歴
   */
  async getConversationHistory(userId: string, limit: number = 50): Promise<AiChatRecord[]> {
    return prisma.aiChat.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  /**
   * 使用制限をチェックする （1 日の使用回数が上限を超えているかどうか）
   * @param userId ユーザー ID
   * @returns 制限を超えているかどうか
   */
  async isLimitExceeded(userId: string): Promise<boolean> {
    const usageCount = await this.getTodayUsageCount(userId);

    return usageCount >= AI_CHAT_DAILY_USAGE_LIMIT;
  },
};
