import { NextResponse, type NextRequest } from 'next/server';
import { withAuth } from '@/utils/auth';
import { channelOperations } from '@/lib/db';
import { User } from '@/types/workspace';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// パラメーターの型定義
type Params = { params: { channelId: string } };

// チャンネル ID のバリデーションスキーマ
const channelIdSchema = z.object({
  channelId: z.string().cuid({ message: 'チャンネル ID が正しい形式ではありません' }),
});

/**
 * [GET] /api/channels/:channelId: 特定のチャンネルの詳細を取得
 */
export const GET = withAuth(async (request: NextRequest, { params }: Params, user: User) => {
  // パラメーターのバリデーション
  const result = channelIdSchema.safeParse({ channelId: params.channelId });
  if (!result.success) {
    return NextResponse.json({ error: result.error.format(), message: 'チャンネル ID が無効です' }, { status: 400 });
  }

  // パラメーターからチャンネル ID を取得
  const { channelId } = params;

  try {
    // チャンネル情報を取得
    const channel = await channelOperations.getChannelById(channelId);
    if (!channel) return NextResponse.json({ error: 'チャンネルが見つかりません' }, { status: 404 });

    // チャンネルのメンバーに、このユーザーが含まれているか確認
    const isMember = channel.members.some((member) => member.id === user.id);
    if (!isMember) return NextResponse.json({ error: 'このチャンネルにアクセスする権限がありません' }, { status: 403 });

    return NextResponse.json(channel);
  } catch (error) {
    console.error('チャンネル情報の取得に失敗しました:', error);

    return NextResponse.json({ error: 'チャンネル情報の取得に失敗しました' }, { status: 500 });
  }
});
