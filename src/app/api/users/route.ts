import { NextRequest, NextResponse } from 'next/server';
import { userOperations } from '@/lib/db';
import { withAuth } from '@/utils/auth';
import { User } from '@/types/workspace';

export const dynamic = 'force-dynamic';

/**
 * [GET] /api/users: 自分以外の全てのユーザーを取得
 */
export const GET = withAuth(async (request: NextRequest, _, user: User) => {
  const users = await userOperations.getAllUsersWithoutMe(user.id);

  return NextResponse.json(users);
});
