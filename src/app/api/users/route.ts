import { NextResponse } from 'next/server';
import { userOperations } from '@/lib/db';

/**
 * [GET] /api/users: すべてのユーザーを取得
 */
export async function GET() {
  try {
    const users = await userOperations.getAllUsers();

    return NextResponse.json(users);
  } catch (error) {
    console.error('ユーザー情報の取得に失敗しました:', error);

    return NextResponse.json({ error: 'ユーザー情報の取得に失敗しました' }, { status: 500 });
  }
}
