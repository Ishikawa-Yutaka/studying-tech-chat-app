// アイコン
import { LogOut } from 'lucide-react';
// shadcn/ui
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
// 型
import type { MyProfile } from '@/types/workspace';

export default function UserProfileBar({ myProfile }: { myProfile: MyProfile }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarFallback>{myProfile.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-medium leading-none">{myProfile.name}</p>
        <p className="text-xs text-muted-foreground">{myProfile.email}</p>
      </div>

      <Button variant="ghost" size="icon">
        <LogOut className="h-4 w-4" />
        <span className="sr-only">ログアウト</span>
      </Button>
    </div>
  );
}
