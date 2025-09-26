import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { userOperations } from '@/lib/db';
import { User } from '@/types/workspace';

/**
 * 認証されているユーザー情報を取得する
 *
 * @returns 成功時: User, 失敗時: NextResponse
 */
export async function getAuthenticatedUser(): Promise<User | NextResponse> {
  try {
    // Supabase Auth から、認証されているユーザーの情報を取得
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return NextResponse.json({ error: '認証されていません' }, { status: 401 });

    const authUser = data.user;

    // Prisma データベースから、認証 ID に紐づくユーザー情報を取得
    const user = await userOperations.getUserByAuthId(authUser.id);
    if (!user) return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });

    return user;
  } catch (error) {
    console.error('認証処理でエラーが発生しました:', error);

    return NextResponse.json({ error: '認証処理でエラーが発生しました' }, { status: 500 });
  }
}

/**
 * ルートハンドラをラップして認証を追加する高階関数 (関数を返す関数)
 *
 * @param handler 元のルートハンドラ関数
 *
 * - request: Next.js のリクエストオブジェクト
 * - context: ルートハンドラのコンテキスト (params など)
 * - user: 認証されたユーザー情報
 *
 * @returns ラップされたハンドラ関数
 */
export function withAuth<T extends Record<string, unknown>>(
  handler: (request: NextRequest, context: T, user: User) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: T) => {
    const result = await getAuthenticatedUser();

    // エラーレスポンスの場合はそのまま返す
    if (result instanceof NextResponse) return result;

    // 認証成功した場合は、ルートハンドラ関数を実行
    return handler(request, context, result);
  };
}
