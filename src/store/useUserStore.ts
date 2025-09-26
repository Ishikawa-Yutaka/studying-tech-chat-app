import { create } from 'zustand';
// 型
import { User } from '@/types/workspace';

interface UserState {
  // ユーザー情報を保持する State
  user: User | null;
  // ローディング状態
  isLoading: boolean;
  // エラー情報
  error: string | null;
  // 現在ログイン中のユーザー情報を取得する Action
  fetchCurrentUser: () => Promise<void>;
  // ユーザー情報をクリアする Action
  clearUser: () => void;
}

// Zustand を使って UserState ストアを作成
export const useUserStore = create<UserState>((set) => ({
  // 初期 State
  user: null,
  isLoading: false,
  error: null,

  fetchCurrentUser: async () => {
    try {
      set({ isLoading: true, error: null });

      // API からユーザー情報を取得
      const res = await fetch('/api/users/me');

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'ユーザー情報の取得に失敗しました');
      }

      const user = (await res.json()) as User;
      set({ user, isLoading: false });
    } catch (error) {
      console.error('ユーザー情報の取得に失敗:', error);
      set({
        error: error instanceof Error ? error.message : 'ユーザー情報の取得に失敗しました',
        isLoading: false,
      });
    }
  },

  clearUser: () => {
    set({ user: null, error: null });
  },
}));
