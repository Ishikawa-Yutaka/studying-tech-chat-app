import { prisma } from '@/lib/prisma';
// 型
import { User, ChannelType, Channel, Message } from '@/types/workspace';

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
  async createChannel(name: string | undefined, description: string | undefined, type: ChannelType, creatorUserId: string, otherUserId?: string): Promise<Channel> {
    const channel = await prisma.channel.create({
      data: {
        name: type === ChannelType.CHANNEL ? name : null,
        description: type === ChannelType.CHANNEL ? description : null,
        type: type,
        members: {
          create: type === ChannelType.DM && otherUserId 
            ? [
                { userId: creatorUserId },
                { userId: otherUserId }
              ]
            : { userId: creatorUserId }
        }
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
