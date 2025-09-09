'use client';

// React
import { useState } from 'react';
// アイコン
import { Search, UserPlus } from 'lucide-react';
// shadcn/ui
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
// データ
import { MY_USER_ID, users } from '@/data/workspace';
// 型
import type { User, Channel } from '@/types/workspace';

interface InviteMemberModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  channel: Channel;
}

export default function InviteMemberModal({ isOpen, onOpenChange, channel }: InviteMemberModalProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  // 選択中のユーザーは、チェックボックスで複数選択できるようにする
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // 自分以外のユーザーで、まだチャンネルに参加していないユーザーを取得
  const availableUsers = users.filter(
    (user) => user.id !== MY_USER_ID && !channel.members.some((member) => member.id === user.id)
  );

  // 検索クエリに基づいてユーザーをフィルタリング
  const filteredUsers = availableUsers.filter(
    (user) => searchQuery === '' || user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleInvite = () => {
    // 今は見た目だけの実装なので、実際の招待処理は行わない
    onOpenChange(false);
    setSelectedUsers([]);
    setSearchQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle># {channel.name} にメンバーを招待</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ユーザーを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          <ScrollArea className="h-72">
            <div className="space-y-1">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer hover:bg-muted"
                    onClick={() => toggleUserSelection(user)}
                  >
                    <Checkbox
                      checked={selectedUsers.some((u) => u.id === user.id)}
                      onCheckedChange={() => toggleUserSelection(user)}
                      id={`user-${user.id}`}
                      className="h-4 w-4"
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium">{user.name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {availableUsers.length === 0
                    ? 'すべてのユーザーが既にチャンネルに参加しています'
                    : '該当するユーザーが見つかりませんでした'}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{selectedUsers.length}人のユーザーを選択中</p>
          <Button onClick={handleInvite} disabled={selectedUsers.length === 0} className="gap-2">
            <UserPlus className="h-4 w-4" />
            招待する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
