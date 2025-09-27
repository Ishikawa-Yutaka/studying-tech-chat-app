import { NextResponse, type NextRequest } from 'next/server';
import { withAuth } from '@/utils/auth';
import { User } from '@/types/workspace';
import { aiChatOperations } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const GET = withAuth(async (request: NextRequest, _, user: User) => {
  try {
    // 残り使用回数を取得
    const remaining = await aiChatOperations.getRemainingUsage(user.id);

    return NextResponse.json({ remaining });
  } catch (error) {
    console.error('残り回数の確認に失敗しました:', error);

    return NextResponse.json({ error: '残り回数の確認に失敗しました' }, { status: 500 });
  }
});
