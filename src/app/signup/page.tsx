'use client';

// React
import { useState, useEffect } from 'react';
// Next.js
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// Zod, React Hook Form (バリデーション)
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
// サーバーアクション
import { signup } from '@/app/signup/actions';

// バリデーションスキーマ
const formSchema = z.object({
  name: z.string().min(1, { message: '名前は必須です' }),
  email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
  password: z.string().min(6, { message: 'パスワードは 6 文字以上必要です' }),
});

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // URL パラメータからエラーメッセージを取得
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam) {
      setError(errorParam);
      // URLからエラーパラメータを削除
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // フォームの設定
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    console.log('クライアント側: handleSubmit開始', values);

    try {
      // FormData オブジェクトを作成
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('password', values.password);

      console.log('クライアント側: FormData作成完了');

      // サーバーアクションを呼び出し（サーバー側でリダイレクトされるため、ここでのリダイレクトは不要）
      console.log('クライアント側: signup関数呼び出し開始');
      await signup(formData);
      console.log('クライアント側: signup関数呼び出し完了');
    } catch (err) {
      console.error('クライアント側登録エラー:', err);
      setError('アカウント登録中にエラーが発生しました。もう一度お試しください。');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost">← ホームに戻る</Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-md px-5">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">アカウント作成</h1>
          <p className="text-sm text-muted-foreground">以下の情報を入力して新規アカウントを作成してください</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>新規登録</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>名前</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="山田 太郎"
                          autoCapitalize="none"
                          autoCorrect="off"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@example.com"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>パスワード</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="パスワード"
                          type="password"
                          autoCapitalize="none"
                          autoCorrect="off"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && <div className="text-sm font-medium text-destructive">{error}</div>}

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && (
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  アカウント作成
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              アカウントをお持ちの場合は{' '}
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                ログイン
              </Link>
              してください
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
