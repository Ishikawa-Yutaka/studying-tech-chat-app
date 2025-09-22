'use client';

// React
import { useState } from 'react';
// Next.js
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// Zod と React Hook Form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
// サーバーアクション
import { login } from './actions';

// バリデーションスキーマ
const formSchema = z.object({
  email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
  password: z.string().min(1, { message: 'パスワードは必須です' }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // フォームの設定
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      // FormData オブジェクトを作成
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);

      // サーバーアクションを呼び出し
      await login(formData);

      // 正常に完了した場合（リダイレクトされるので通常はここには到達しない）
      router.push('/workspace');
    } catch (err) {
      console.error('ログインエラー:', err);
      setError('ログイン中にエラーが発生しました。メールアドレスとパスワードを確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost">← ホームに戻る</Button>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:max-w-md px-4">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">アカウントにログイン</h1>
          <p className="text-sm text-muted-foreground">メールアドレスを入力してログインしてください</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>ログイン</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                  ログイン
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              アカウントをお持ちでない場合は{' '}
              <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                新規登録
              </Link>
              してください
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
