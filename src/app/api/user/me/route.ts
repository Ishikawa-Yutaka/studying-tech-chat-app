import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { userOperations } from '@/lib/db';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user: authUser }, error } = await supabase.auth.getUser();

    if (error || !authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // データベースからユーザー情報を取得
    const dbUser = await userOperations.getUserByAuthId(authUser.id);

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
    });
  } catch (error) {
    console.error('API /user/me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}