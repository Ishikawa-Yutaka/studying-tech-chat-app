import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const helloSchema = z.object({
  name: z.string().min(1, '名前は空にできません'),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  // バリデーションを実行
  const result = helloSchema.safeParse({ name });

  // バリデーションに失敗した場合はエラーレスポンスを返す
  if (!result.success) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  // バリデーションに成功した場合はレスポンスを返す
  return NextResponse.json({ message: `Hello, ${result.data.name}!` }, { status: 200 });
}
