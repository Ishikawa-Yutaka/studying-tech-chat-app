import { create } from 'zustand';
// 型
import { Message } from '@/types/workspace';
// データ
import { getChannelMessages } from '@/data/workspace';

interface MessageState {
  // メッセージの配列を保持する State
  messages: Message[];
  // 特定チャンネルのメッセージを取得する Action
  fetchMessages: (channelId: number) => void;
  // 新しいメッセージを追加する Action
  addMessage: (message: Message) => void;
}

// Zustand を使って MessageState ストアを作成
export const useMessageStore = create<MessageState>((set) => ({
  // 初期 State
  messages: [],

  fetchMessages: (channelId: number) => {
    // TODO: 実際には、データベースからメッセージを取得
    const channelMessages = getChannelMessages(channelId);
    // 取得したメッセージで状態を更新
    set({ messages: channelMessages });
  },

  addMessage: (message: Message) => {
    // 現在のメッセージ配列に新しいメッセージを追加
    set((state) => ({ messages: [...state.messages, message] }));
  },
}));
