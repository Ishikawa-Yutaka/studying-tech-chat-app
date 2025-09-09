import { ChannelType, type Channel, type User, type Message } from '@/types/workspace';

// TODO: これらのデータは、実際にはデータベースから取得する

// 自分の ID (実際には、データベースや認証システムから取得する)
export const MY_USER_ID = 1;

// サンプルユーザーデータ

export const users: User[] = [
  { id: MY_USER_ID, name: '自分', email: 'me@example.com' },
  { id: 2, name: '田中 一郎', email: 'tanaka@example.com' },
  { id: 3, name: '佐藤 次郎', email: 'sato@example.com' },
  { id: 4, name: '鈴木 三郎', email: 'suzuki@example.com' },
  { id: 5, name: '山田 四郎', email: 'yamada@example.com' },
  { id: 6, name: '小林 五郎', email: 'kobayashi@example.com' },
  { id: 7, name: '松本 六郎', email: 'matsumoto@example.com' },
  { id: 8, name: '渡辺 七郎', email: 'watanabe@example.com' },
  { id: 9, name: '中村 八郎', email: 'nakamura@example.com' },
  { id: 10, name: '高橋 九郎', email: 'takahashi@example.com' },
];
/**
 * ID を指定してユーザーを取得する
 */
export function getUser(id: number): User {
  const user = users.find((user) => user.id === id);
  if (!user) throw new Error('ユーザーが見つかりませんでした');

  return user;
}

// サンプルチャンネルデータ
export const channels: Channel[] = [
  {
    id: 1,
    name: '一般',
    description: '全体的な議論のためのチャンネルです',
    channelType: ChannelType.CHANNEL,
    members: [getUser(MY_USER_ID), getUser(2), getUser(3), getUser(4)],
  },
  {
    id: 2,
    name: 'ランダム',
    description: '雑談や気軽な会話のためのチャンネルです',
    channelType: ChannelType.CHANNEL,
    members: [getUser(MY_USER_ID), getUser(2), getUser(3), getUser(4)],
  },
  {
    id: 3,
    name: 'お知らせ',
    description: '重要なお知らせを共有するチャンネルです',
    channelType: ChannelType.CHANNEL,
    members: [getUser(MY_USER_ID), getUser(2), getUser(3), getUser(4)],
  },
  {
    id: 4,
    channelType: ChannelType.DM,
    members: [getUser(MY_USER_ID), getUser(2)],
  },
  {
    id: 5,
    channelType: ChannelType.DM,
    members: [getUser(MY_USER_ID), getUser(3)],
  },
  {
    id: 6,
    channelType: ChannelType.DM,
    members: [getUser(MY_USER_ID), getUser(4)],
  },
];

/**
 * ID を指定してチャンネルを取得する
 */
export function getChannel(id: number): Channel {
  const channel = channels.find((channel) => channel.id === id);
  if (!channel) throw new Error('チャンネルが見つかりませんでした');

  return channel;
}

/**
 * DM において、相手のユーザーを取得する
 */
export function getDirectMessagePartner(channel: Channel, myUserId: number): User {
  if (channel.channelType !== ChannelType.DM) throw new Error('チャンネルが DM ではありません');

  const otherUser = channel.members.find((user) => user.id !== myUserId);
  if (!otherUser) throw new Error('ユーザーが見つかりませんでした');

  return otherUser;
}

// サンプルメッセージデータ
export const messages: Message[] = [
  {
    id: 1,
    channel: getChannel(1),
    sender: getUser(2),
    content: 'おはようございます！今日のミーティングは何時からでしたか？',
    createdAt: new Date('2025-03-23T09:30:00Z'),
  },
  {
    id: 2,
    channel: getChannel(1),
    sender: getUser(3),
    content: 'おはようございます！10時からです。議題は先日のプロジェクト進捗についてです。',
    createdAt: new Date('2025-03-23T09:32:00Z'),
  },
  {
    id: 3,
    channel: getChannel(1),
    sender: getUser(4),
    content: '資料は事前に共有しておきました。ご確認ください。',
    createdAt: new Date('2025-03-23T09:35:00Z'),
  },
  {
    id: 4,
    channel: getChannel(1),
    sender: getUser(MY_USER_ID),
    content: 'ありがとうございます。確認しました。',
    createdAt: new Date('2025-03-23T09:40:00Z'),
  },
  {
    id: 5,
    channel: getChannel(4),
    sender: getUser(MY_USER_ID),
    content: 'こんにちは！プロジェクトの進捗はどうですか？',
    createdAt: new Date('2025-03-23T14:30:00Z'),
  },
  {
    id: 6,
    channel: getChannel(4),
    sender: getUser(2),
    content: '順調に進んでいます。明日までに完了する予定です。',
    createdAt: new Date('2025-03-23T14:32:00Z'),
  },
  {
    id: 7,
    channel: getChannel(4),
    sender: getUser(MY_USER_ID),
    content: '素晴らしいですね。何か問題があれば教えてください。',
    createdAt: new Date('2025-03-23T14:35:00Z'),
  },
  {
    id: 8,
    channel: getChannel(5),
    sender: getUser(2),
    content: '明日の会議の資料を送りました。',
    createdAt: new Date('2025-03-23T14:30:00Z'),
  },
  {
    id: 9,
    channel: getChannel(5),
    sender: getUser(MY_USER_ID),
    content: 'ありがとうございます。確認しました。',
    createdAt: new Date('2025-03-23T14:32:00Z'),
  },
  {
    id: 10,
    channel: getChannel(6),
    sender: getUser(MY_USER_ID),
    content: 'お疲れ様です！',
    createdAt: new Date('2025-03-23T14:35:00Z'),
  },
  {
    id: 11,
    channel: getChannel(6),
    sender: getUser(3),
    content: 'お疲れ様です！今週もよろしくお願いします。',
    createdAt: new Date('2025-03-23T14:38:00Z'),
  },
];

/**
 * ID を指定してメッセージを取得する
 */
export function getMessage(id: number): Message {
  const message = messages.find((message) => message.id === id);
  if (!message) throw new Error('メッセージが見つかりませんでした');

  return message;
}

/**
 * チャンネル ID を指定してメッセージを取得する
 */
export function getChannelMessages(channelId: number): Message[] {
  return messages.filter((message) => message.channel.id === channelId);
}
