import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-background">
      <div className="space-y-6 max-w-md">
        <div className="flex justify-center">
          <AlertCircle className="h-24 w-24 text-muted-foreground" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight">ページが見つかりません</h1>

        <p className="text-xl text-muted-foreground">お探しのリソースは存在しないか、移動された可能性があります。</p>

        <div className="flex gap-4 justify-center">
          <Button asChild className="mt-8 gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              ホームに戻る
            </Link>
          </Button>

          <Button asChild className="mt-8 gap-2">
            <Link href="/workspace">
              <Home className="h-4 w-4" />
              ワークスペースに戻る
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
