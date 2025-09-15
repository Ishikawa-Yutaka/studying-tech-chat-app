import { prisma } from '@/lib/prisma';

/**
 * ユーザー関連の操作
 */
export const userOperations = {
  // すべてのユーザーを取得
  async getAllUsers() {
    return prisma.user.findMany();
  },
};
