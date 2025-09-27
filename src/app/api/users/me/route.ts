import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/utils/auth';
import { User } from '@/types/workspace';

export const dynamic = 'force-dynamic';

/**
 * [GET] /api/users/me: 現在認証されているユーザーの情報を取得
 */
export const GET = withAuth(async (request: NextRequest, _, user: User) => {
  // 認証済みユーザーの情報をそのまま返す
  return NextResponse.json(user);
});
