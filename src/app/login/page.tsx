'use client';

// React
import { useState } from 'react';
// Next.js
import Link from 'next/link';
// shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // TODO: ここにフォームの値の useState や バリデーションロジックを実装

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: ここに認証ロジックを実装

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
            <div className="relative"></div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="password">パスワード</Label>
                  <Input
                    id="password"
                    placeholder="パスワード"
                    type="password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                </div>
                <Button disabled={isLoading}>
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
              </div>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-center text-sm text-muted-foreground">
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
