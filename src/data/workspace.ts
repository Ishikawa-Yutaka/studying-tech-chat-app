import type { Channel, DirectMessage, MyProfile } from '@/types/workspace';

// TODO: これらのデータは、実際にはデータベースから取得する

// サンプルプロフィール情報
export const channels: Channel[] = [
  { id: 1, name: '一般', description: '全体的な議論のためのチャンネルです' },
  {
    id: 2,
    name: 'ランダム',
    description: '雑談や気軽な会話のためのチャンネルです',
  },
  {
    id: 3,
    name: 'お知らせ',
    description: '重要なお知らせを共有するチャンネルです',
  },
];

// サンプル DM データ
export const directMessages: DirectMessage[] = [
  { id: 1, name: '田中 一郎' },
  { id: 2, name: '佐藤 次郎' },
  { id: 3, name: '鈴木 三郎' },
];

// サンプルユーザー情報
export const myProfile: MyProfile = {
  name: 'ユーザー名',
  email: 'user@example.com',
};
