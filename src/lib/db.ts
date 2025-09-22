import { prisma } from '@/lib/prisma';

/**
 * ユーザー関連の操作
 */
export const userOperations = {
  // ユーザーを作成
  async createUser(authId: string, email: string, name: string) {
    return prisma.user.create({ data: { authId, email, name } });
  },

  // すべてのユーザーを取得
  async getAllUsers() {
    return prisma.user.findMany();
  },
};
