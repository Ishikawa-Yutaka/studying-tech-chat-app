import { NextResponse, NextRequest } from 'next/server';
import { withAuth } from '@/utils/auth';
import { channelOperations } from '@/lib/db';
import { User, ChannelType } from '@/types/workspace';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

/**
 * [GET] /api/channels: 現在認証されているユーザーが参加しているチャンネルを取得
 */
export const GET = withAuth(async (request: NextRequest, _, user: User) => {
  try {
    const channels = await channelOperations.getChannelsByUserId(user.id);

    return NextResponse.json(channels);
  } catch (error) {
    console.error('チャンネル情報の取得に失敗しました:', error);

    return NextResponse.json({ error: 'チャンネル情報の取得に失敗しました' }, { status: 500 });
  }
});

// チャンネル作成のバリデーションスキーマ
const createChannelSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'チャンネル名は必須です' })
    .max(50, { message: 'チャンネル名は50文字以下にしてください' })
    .optional(),
  description: z.string().max(200, { message: '説明は200文字以下にしてください' }).optional(),
  type: z.enum(['channel', 'dm'], { message: 'チャンネルタイプが無効です' }).default('channel'),
  otherUserId: z.string().optional(), // DM作成時の相手ユーザーID
});

/**
 * [POST] /api/channels: 新しいチャンネルを作成
 */
export const POST = withAuth(async (request: NextRequest, _, user: User) => {
  try {
    // リクエストボディのバリデーション
    const body = await request.json();
    const result = createChannelSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.format(), message: 'チャンネル情報が無効です' }, { status: 400 });
    }

    const { name, description, type, otherUserId } = result.data;

    // バリデーション：DMの場合はotherUserIdが必須、チャンネルの場合はnameが必須
    if (type === 'dm' && !otherUserId) {
      return NextResponse.json({ error: 'DMの作成には相手ユーザーIDが必要です' }, { status: 400 });
    }
    if (type === 'channel' && !name) {
      return NextResponse.json({ error: 'チャンネルの作成にはチャンネル名が必要です' }, { status: 400 });
    }

    // チャンネル/DMを作成
    const channel = await channelOperations.createChannel(name, description, type as ChannelType, user.id, otherUserId);

    return NextResponse.json(channel, { status: 201 });
  } catch (error) {
    console.error('チャンネルの作成に失敗しました:', error);

    return NextResponse.json({ error: 'チャンネルの作成に失敗しました' }, { status: 500 });
  }
});
