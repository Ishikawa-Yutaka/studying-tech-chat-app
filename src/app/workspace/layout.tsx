'use client';

// React
import { useState } from 'react';
// Next.js
import { usePathname } from 'next/navigation';
// アイコン
import { Menu } from 'lucide-react';
// shadcn/ui
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
// 自作コンポーネント
import AppLogo from '@/components/workspace/appLogo';
import ChannelList from '@/components/workspace/channelList';
import DirectMessageList from '@/components/workspace/directMessageList';
import UserProfileBar from '@/components/workspace/userProfileBar';
// データ
import { channels, directMessages, myProfile } from '@/data/workspace';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* モバイルナビゲーション */}
      <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            <div className="px-6 py-4">
              <AppLogo />
            </div>
            <Separator />
            <div className="flex-1">
              <div className="px-2 py-2">
                <ChannelList channels={channels} pathname={pathname} />
                <Separator className="my-2" />
                <DirectMessageList directMessages={directMessages} pathname={pathname} />
              </div>
            </div>
            <Separator />
            <div className="p-4">
              <UserProfileBar myProfile={myProfile} />
            </div>
          </SheetContent>
        </Sheet>
        <AppLogo />
      </header>

      {/* デスクトップレイアウト */}
      <div className="flex-1 items-start lg:grid lg:grid-cols-[280px_1fr]">
        {/* サイドバー (デスクトップのみ表示) */}
        <aside className="hidden border-r bg-background lg:flex lg:flex-col lg:justify-between lg:h-full">
          <div className="flex h-14 items-center border-b px-6">
            <AppLogo />
          </div>
          <div className="px-2 flex-1">
            <ChannelList channels={channels} pathname={pathname} />
            <Separator className="my-2" />
            <DirectMessageList directMessages={directMessages} pathname={pathname} />
          </div>
          <div className="sticky bottom-0 border-t bg-background p-4">
            <UserProfileBar myProfile={myProfile} />
          </div>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex flex-col h-screen">{children}</main>
      </div>
    </div>
  );
}
