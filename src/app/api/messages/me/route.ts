import { NextResponse, type NextRequest } from 'next/server';
import { withAuth } from '@/utils/auth';
import { messageOperations } from '@/lib/db';
import { User } from '@/types/workspace';

export const dynamic = 'force-dynamic';

/**
 * [GET] /api/messages/me: 自分のメッセージを取得
 */
export const GET = withAuth(async (request: NextRequest, _, user: User) => {
  try {
    // 自分のメッセージを取得
    const messages = await messageOperations.getMessagesBySenderId(user.id);

    return NextResponse.json(messages);
  } catch (error) {
    console.error('メッセージの取得に失敗しました:', error);

    return NextResponse.json({ error: 'メッセージの取得に失敗しました' }, { status: 500 });
  }
});
