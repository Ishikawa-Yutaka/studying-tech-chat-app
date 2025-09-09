// Next.js
import Link from 'next/link';
// アイコン
import { PlusCircle } from 'lucide-react';
// shadcn/ui
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
// 型
import type { DirectMessage } from '@/types/workspace';

export default function DirectMessageList({
  directMessages,
  pathname,
}: {
  directMessages: DirectMessage[];
  pathname: string;
}) {
  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">ダイレクトメッセージ</h2>
        <Button variant="ghost" size="icon">
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only">DM 追加</span>
        </Button>
      </div>

      <div className="space-y-1 mt-2">
        {directMessages.map((dm) => (
          <Button
            key={dm.id}
            variant={pathname === `/workspace/channel/${dm.id}` ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-2"
            asChild
          >
            <Link href={`/workspace/channel/${dm.id}`}>
              <div className="relative">
                <Avatar className="h-4 w-4">
                  <AvatarFallback>{dm.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              {dm.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
