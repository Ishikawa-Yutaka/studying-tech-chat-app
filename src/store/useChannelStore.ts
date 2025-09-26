import { create } from 'zustand';
// 型
import { Channel } from '@/types/workspace';

interface ChannelState {
  // チャンネル一覧
  channels: Channel[];
  // 現在選択されているチャンネル
  currentChannel: Channel | null;
  // ローディング状態
  isLoading: boolean;
  // エラー情報
  error: string | null;
  // チャンネル一覧を取得する Action
  fetchChannels: () => Promise<void>;
  // 新しいチャンネルを作成する Action
  createChannel: (name: string, description?: string) => Promise<Channel>;
  // 新しいDMを作成する Action
  createDirectMessage: (otherUserId: string) => Promise<Channel>;
  // チャンネル一覧をクリアする Action
  clearChannels: () => void;
}

// Zustand を使って ChannelState ストアを作成
export const useChannelStore = create<ChannelState>((set, get) => ({
  // 初期 State
  channels: [],
  currentChannel: null,
  isLoading: false,
  error: null,

  // チャンネル一覧を取得
  fetchChannels: async () => {
    try {
      set({ isLoading: true, error: null });

      // API からチャンネル一覧を取得
      const res = await fetch('/api/channels');

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'チャンネル一覧の取得に失敗しました');
      }

      const channels = (await res.json()) as Channel[];
      set({ channels, isLoading: false });
    } catch (error) {
      console.error('チャンネル一覧の取得に失敗:', error);
      set({
        error: error instanceof Error ? error.message : 'チャンネル一覧の取得に失敗しました',
        isLoading: false,
      });
    }
  },

  // 新しいチャンネルを作成
  createChannel: async (name: string, description?: string) => {
    try {
      const res = await fetch('/api/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, type: 'channel' }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'チャンネルの作成に失敗しました');
      }

      const newChannel = (await res.json()) as Channel;
      
      // 新しいチャンネルをチャンネルリストに追加
      set((state) => ({ 
        channels: [...state.channels, newChannel],
        error: null 
      }));

      return newChannel;
    } catch (error) {
      console.error('チャンネルの作成に失敗しました:', error);
      set({
        error: error instanceof Error ? error.message : 'チャンネルの作成に失敗しました',
      });
      throw error;
    }
  },

  // 新しいDMを作成
  createDirectMessage: async (otherUserId: string) => {
    try {
      const res = await fetch('/api/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: 'dm',
          otherUserId: otherUserId
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'DMの作成に失敗しました');
      }

      const newChannel = (await res.json()) as Channel;
      
      // 新しいDMをチャンネルリストに追加
      set((state) => ({ 
        channels: [...state.channels, newChannel],
        error: null 
      }));

      return newChannel;
    } catch (error) {
      console.error('DMの作成に失敗しました:', error);
      set({
        error: error instanceof Error ? error.message : 'DMの作成に失敗しました',
      });
      throw error;
    }
  },

  clearChannels: () => {
    set({ channels: [] });
  },
}));
