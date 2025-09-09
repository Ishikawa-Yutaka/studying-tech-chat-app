'use client';

// React
import { useState } from 'react';
// Next.js
import Link from 'next/link';
// アイコン
import { PlusCircle, Hash } from 'lucide-react';
// shadcn/ui
import { Button } from '@/components/ui/button';
// 自作コンポーネント
import CreateChannelModal from './createChannelModal';
// 型
import type { Channel } from '@/types/workspace';

export default function ChannelList({ channels, pathname }: { channels: Channel[]; pathname: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">チャンネル</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only">チャンネル追加</span>
        </Button>
      </div>

      <CreateChannelModal isOpen={isOpen} onOpenChange={setIsOpen} />

      <div className="space-y-1 mt-2">
        {channels.map((channel) => (
          <Button
            key={channel.id}
            variant={pathname === `/workspace/channel/${channel.id}` ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-2"
            asChild
          >
            <Link href={`/workspace/channel/${channel.id}`}>
              <Hash className="h-4 w-4" />
              {channel.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
