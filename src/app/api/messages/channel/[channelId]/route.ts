import { NextResponse, type NextRequest } from 'next/server';
import { withAuth } from '@/utils/auth';
import { channelOperations, messageOperations } from '@/lib/db';
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
 * [GET] /api/messages/channel/:channelId: 特定のチャンネルのメッセージを取得
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
    // チャンネル情報を取得して、アクセス権をチェック
    const channel = await channelOperations.getChannelById(channelId);
    if (!channel) return NextResponse.json({ error: 'チャンネルが見つかりません' }, { status: 404 });

    // チャンネルのメンバーに、このユーザーが含まれているか確認
    const isMember = channel.members.some((member) => member.id === user.id);
    if (!isMember) return NextResponse.json({ error: 'このチャンネルにアクセスする権限がありません' }, { status: 403 });

    // チャンネル ID に基づいてメッセージを取得
    const messages = await messageOperations.getMessagesByChannelId(channelId);

    return NextResponse.json(messages);
  } catch (error) {
    console.error('メッセージの取得に失敗しました:', error);

    return NextResponse.json({ error: 'メッセージの取得に失敗しました' }, { status: 500 });
  }
});

// メッセージ送信のバリデーションスキーマ
const messageSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'メッセージ内容は必須です' })
    .max(1000, { message: 'メッセージは1000文字以下にしてください' }),
});

/**
 * [POST] /api/messages/channel/:channelId: 特定のチャンネルにメッセージを送信
 */
export const POST = withAuth(async (request: NextRequest, { params }: Params, user: User) => {
  // パラメーターのバリデーション
  const channelResult = channelIdSchema.safeParse({ channelId: params.channelId });
  if (!channelResult.success) {
    return NextResponse.json(
      { error: channelResult.error.format(), message: 'チャンネル ID が無効です' },
      { status: 400 }
    );
  }

  // リクエストボディのバリデーション
  const body = await request.json();
  const messageResult = messageSchema.safeParse(body);
  if (!messageResult.success) {
    return NextResponse.json(
      { error: messageResult.error.format(), message: 'メッセージ内容が無効です' },
      { status: 400 }
    );
  }

  const { channelId } = params;
  const { content } = messageResult.data;

  try {
    // チャンネル情報を取得して、アクセス権をチェック
    const channel = await channelOperations.getChannelById(channelId);
    if (!channel) return NextResponse.json({ error: 'チャンネルが見つかりません' }, { status: 404 });

    // チャンネルのメンバーに、このユーザーが含まれているか確認
    const isMember = channel.members.some((member) => member.id === user.id);
    if (!isMember)
      return NextResponse.json({ error: 'このチャンネルにメッセージを送信する権限がありません' }, { status: 403 });

    // メッセージを作成
    const message = await messageOperations.createMessage(channelId, user.id, content);

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('メッセージの送信に失敗しました:', error);

    return NextResponse.json({ error: 'メッセージの送信に失敗しました' }, { status: 500 });
  }
});
