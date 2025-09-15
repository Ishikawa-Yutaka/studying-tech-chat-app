import { PrismaClient } from '@prisma/client';

/**
 * グローバルオブジェクトに PrismaClient のインスタンスを保存するための型定義
 *
 * TypeScript のグローバル型を拡張して、 prisma プロパティを持つようにキャストします。
 * グローバルオブジェクトは、 Next.js のコンテキストでは常に存在するオブジェクトです。
 * これにより、グローバルオブジェクトに PrismaClient のインスタンスを保存することができます。
 */
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * PrismaClient のシングルトンインスタンス
 *
 * グローバルオブジェクトに既存のインスタンスがあればそれを使用し、なければ新しいインスタンスを作成します。
 * これにより、アプリケーション全体で単一のデータベース接続を共有できます。
 * シングルトンパターンとは、同じクラスのインスタンスが 1 つしか存在しないことを保証するデザインパターンです。
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

/**
 * 開発環境でのインスタンス管理
 *
 * 開発環境では、ホットリロードによってインスタンスが複数作成されることを防ぐため、作成したインスタンスをグローバルオブジェクトに保存します。
 * 本番環境ではこの処理は不要です。そのため、条件分岐で制御しています。
 */
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
