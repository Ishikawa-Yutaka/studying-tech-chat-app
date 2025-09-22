import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  // createServerClient と supabase.auth.getUser() の間にコードを書かないでください。
  // 単純なミスが、ユーザーがランダムにログアウトされる問題のデバッグを非常に困難にする可能性があります。

  // 重要: auth.getUser() を削除しないでください

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 除外したいページ (認証なしで見せても良いページ) を指定
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/signup') &&
    request.nextUrl.pathname !== '/' &&
    request.nextUrl.pathname !== '/error'
  ) {
    // ユーザーがいない場合、ログインページにリダイレクトすることで対応する可能性があります
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 重要: supabaseResponse オブジェクトをそのまま返す必要があります。

  // NextResponse.next() で新しいレスポンスオブジェクトを作成する場合は、必ず以下のことを行ってください:
  //    1. 次のようにリクエストを渡してください:
  //        const myNewResponse = NextResponse.next({ request })
  //    2. 次のようにクッキーをコピーしてください:
  //        myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  //    3. myNewResponseオブジェクトをニーズに合わせて変更しますが、クッキーの変更は避けてください
  //    4. 最後に:
  //       return myNewResponse

  // これを行わないと、ブラウザとサーバーが同期しなくなり、ユーザーのセッションが早期に終了する原因になる可能性があります

  return supabaseResponse;
}
