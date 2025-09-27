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
  id: string;
  name: string;
  email?: string;
}

export interface Channel {
  id: string;
  name?: string;
  description?: string;
  channelType: ChannelType;
  members: User[];
}

export interface Message {
  id: string;
  channelId: string;
  sender: User;
  content: string;
  createdAt: Date;
}

export enum AiChatRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export interface AiChatMessage {
  role: AiChatRole;
  content: string;
}

export interface AiChatRecord {
  id: string;
  userId: string;
  message: string;
  response: string;
  createdAt: Date;
}
