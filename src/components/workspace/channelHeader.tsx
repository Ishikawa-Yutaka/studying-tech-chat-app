'use client';

// React
import { useState } from 'react';
// アイコン
import { Hash, Users } from 'lucide-react';
// shadcn/ui
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
// 自作コンポーネント
import InviteMemberModal from '@/components/channel/inviteMemberModal';
// 型
import { ChannelType, type Channel } from '@/types/workspace';
// データ
import { getDirectMessagePartner } from '@/lib/db';
// ストア
import { useUserStore } from '@/store/useUserStore';

export default function ChannelHeader({ channel }: { channel: Channel }) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const { user } = useUserStore();

  const partner = channel.channelType === ChannelType.DM && user ? getDirectMessagePartner(channel, user.id) : null;

  return (
    <header className="border-b bg-background z-10">
      <div className="h-14 flex items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          {channel.channelType === ChannelType.CHANNEL ? (
            <>
              <Hash className="h-5 w-5" />
              <h1 className="font-semibold">{channel.name}</h1>
            </>
          ) : (
            <>
              <Avatar className="h-8 w-8">
                <AvatarFallback>{partner?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h1 className="font-semibold">{partner?.name}</h1>
            </>
          )}
        </div>

        {channel.channelType === ChannelType.CHANNEL && (
          <>
            <Separator orientation="vertical" className="h-6" />
            <p className="text-sm text-muted-foreground hidden md:block">
              {channel.description} ({channel.members.length} 人のメンバー)
            </p>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsInviteModalOpen(true)}>
                <Users className="mr-2 h-4 w-4" />
                メンバーを招待
              </Button>

              <InviteMemberModal isOpen={isInviteModalOpen} onOpenChange={setIsInviteModalOpen} channel={channel} />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
