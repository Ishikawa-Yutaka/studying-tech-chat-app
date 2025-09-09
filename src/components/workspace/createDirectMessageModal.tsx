'use client';

// React
import { useState } from 'react';
// アイコン
import { Check, Search } from 'lucide-react';
// shadcn/ui
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// データ
import { MY_USER_ID, users } from '@/data/workspace';
// 型
import type { User } from '@/types/workspace';

export default function CreateDirectMessageModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // 検索クエリ
  const [searchQuery, setSearchQuery] = useState<string>('');
  // 選択中のユーザー
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 自分以外のユーザーを取得 (TODO: 実際には、まだ DM を開始していないユーザーに絞り込む)
  const otherUsers = users.filter((user) => user.id !== MY_USER_ID);

  // 検索クエリに基づいてユーザーをフィルタリング
  const filteredUsers = otherUsers.filter(
    (user) => searchQuery === '' || user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartDm = () => {
    // 今は見た目だけの実装なので、実際の DM 開始処理は行わない
    onOpenChange(false);
    setSelectedUser(null);
    setSearchQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>新規ダイレクトメッセージ</DialogTitle>
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
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer ${
                    selectedUser?.id === user.id ? 'bg-primary/10' : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium">{user.name}</p>
                  </div>
                  {selectedUser?.id === user.id && <Check className="h-4 w-4 text-primary" />}
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  該当するユーザーが見つかりませんでした
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button onClick={handleStartDm} disabled={!selectedUser}>
            DMを開始
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
