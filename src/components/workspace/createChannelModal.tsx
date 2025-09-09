'use client';

// React
import { useState } from 'react';
// shadcn/ui
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function CreateChannelModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [channelName, setChannelName] = useState<string>('');
  const [channelDescription, setChannelDescription] = useState<string>('');

  const handleCreateChannel = () => {
    // 今は見た目だけの実装なので、実際のチャンネル作成処理は行わない
    onOpenChange(false);
    setChannelName('');
    setChannelDescription('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新規チャンネル作成</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="channel-name">チャンネル名</Label>
            <Input
              id="channel-name"
              placeholder="チャンネル名を入力してください"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-description">説明（任意）</Label>
            <Textarea
              id="channel-description"
              placeholder="このチャンネルの目的を説明してください"
              value={channelDescription}
              onChange={(e) => setChannelDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleCreateChannel} disabled={!channelName.trim()}>
            作成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
