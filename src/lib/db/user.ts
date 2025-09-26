import { prisma } from '@/lib/prisma';

/**
 * ユーザー関連の操作
 */
export const userOperations = {
  // ユーザーを作成
  async createUser(authId: string, email: string, name: string) {
    return prisma.user.create({ data: { authId, email, name } });
  },

  // 自分以外の全てのユーザーを取得 （セキュリティのために、メールアドレスは含めず id, name のみ取得する）
  async getAllUsersWithoutMe(userId: string) {
    return prisma.user.findMany({
      select: { id: true, name: true },
      where: { id: { not: userId } },
    });
  },

  // 認証 ID からユーザーを取得
  async getUserByAuthId(authId: string) {
    return prisma.user.findUnique({ where: { authId } });
  },
};
