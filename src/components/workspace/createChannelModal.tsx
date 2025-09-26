'use client';

// React
import { useState } from 'react';
// Next.js
import { useRouter } from 'next/navigation';
// shadcn/ui
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// ストア
import { useChannelStore } from '@/store/useChannelStore';

export default function CreateChannelModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [channelName, setChannelName] = useState<string>('');
  const [channelDescription, setChannelDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { createChannel } = useChannelStore();

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      setError('チャンネル名を入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // チャンネルを作成
      const newChannel = await createChannel(channelName.trim(), channelDescription.trim() || undefined);
      
      // モーダルを閉じる
      onOpenChange(false);
      setChannelName('');
      setChannelDescription('');
      
      // 新しく作成されたチャンネルに遷移
      router.push(`/workspace/channel/${newChannel.id}`);
    } catch (error) {
      console.error('チャンネル作成エラー:', error);
      setError('チャンネルの作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
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
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-description">説明（任意）</Label>
            <Textarea
              id="channel-description"
              placeholder="このチャンネルの目的を説明してください"
              value={channelDescription}
              onChange={(e) => setChannelDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-sm font-medium text-destructive">{error}</div>}
        </div>

        <DialogFooter>
          <Button onClick={handleCreateChannel} disabled={!channelName.trim() || isLoading}>
            {isLoading ? '作成中...' : '作成'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
