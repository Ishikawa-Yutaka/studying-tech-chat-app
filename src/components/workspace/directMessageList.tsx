'use client';

// React
import { useState } from 'react';
// Next.js
import Link from 'next/link';
// アイコン
import { PlusCircle } from 'lucide-react';
// shadcn/ui
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
// 自作コンポーネント
import CreateDirectMessageModal from './createDirectMessageModal';
// 型
import type { Channel } from '@/types/workspace';
// データ
import { MY_USER_ID, getDirectMessagePartner } from '@/data/workspace';

function DMButton({ channel, pathname }: { channel: Channel; pathname: string }) {
  const partnerName = getDirectMessagePartner(channel, MY_USER_ID).name;

  return (
    <Button
      key={channel.id}
      variant={pathname === `/workspace/channel/${channel.id}` ? 'secondary' : 'ghost'}
      className="w-full justify-start gap-2"
      asChild
    >
      <Link href={`/workspace/channel/${channel.id}`}>
        <div className="relative">
          <Avatar className="h-4 w-4">
            <AvatarFallback>{partnerName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        {partnerName}
      </Link>
    </Button>
  );
}

export default function DirectMessageList({ channels, pathname }: { channels: Channel[]; pathname: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">ダイレクトメッセージ</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only">DM 追加</span>
        </Button>
      </div>

      <CreateDirectMessageModal isOpen={isOpen} onOpenChange={setIsOpen} />

      <div className="space-y-1 mt-2">
        {channels.map((channel) => (
          <DMButton key={channel.id} channel={channel} pathname={pathname} />
        ))}
      </div>
    </div>
  );
}
