/**
 * データ構造
 *
 * - Channel と Message は 1:N
 * - User と Message は 1:N
 * - Channel と User は N:N
 *
 * @note 実際のテーブル構造としては、 (Channel-User) 中間テーブルを作成する予定
 */

export enum ChannelType {
  CHANNEL = 'channel',
  DM = 'dm',
}

export interface User {
  id: number;
  name: string;
  email: string;
}

// DM の場合は name と description なし
export interface Channel {
  id: number;
  name?: string;
  description?: string;
  channelType: ChannelType;
  members: User[];
}

export interface Message {
  id: number;
  channel: Channel;
  sender: User;
  content: string;
  createdAt: Date;
}
