'use client';

// React
import { useEffect } from 'react';
// Next.js
import { useParams, notFound } from 'next/navigation';
// 自作コンポーネント
import ChannelHeader from '@/components/channel/channelHeader';
import MessageView from '@/components/channel/messageView';
import MessageForm from '@/components/channel/messageForm';
// データ
import { getDirectMessagePartner } from '@/lib/db';
// 型
import { ChannelType } from '@/types/workspace';
// Zustand ストア
import { useMessageStore } from '@/store/useMessageStore';
import { useChannelStore } from '@/store/useChannelStore';
import { useUserStore } from '@/store/useUserStore';

export default function ChannelPage() {
  // URL のパスからチャンネル ID を取得
  const { channelId } = useParams<{ channelId: string }>();

  // ストアからデータを取得
  const { user } = useUserStore();
  const { channels } = useChannelStore();
  const { messages, fetchMessages, sendMessage } = useMessageStore();

  // チャンネルIDからチャンネルを検索
  const channel = channels.find(c => c.id === channelId);

  useEffect(() => {
    // チャンネル ID が変更されたときにメッセージを取得
    if (channelId && channel) {
      fetchMessages(channelId).catch(error => {
        console.error('メッセージ取得エラー:', error);
      });
    }
  }, [channelId, channel, fetchMessages]);

  if (!channel) {
    return notFound();
  }

  const channelDisplayName =
    channel.channelType === ChannelType.CHANNEL
      ? `# ${channel.name}`
      : user ? getDirectMessagePartner(channel, user.id).name : '';

  const handleSendMessage = async (content: string) => {
    if (!user || !channelId) return;

    try {
      // サーバーにメッセージを送信（データベースに保存）
      await sendMessage(channelId, content);
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
      // エラーハンドリングはストア内で行われる
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChannelHeader channel={channel} />
      <MessageView messages={messages} myUserId={user?.id} />
      <MessageForm channelDisplayName={channelDisplayName} handleSendMessage={handleSendMessage} />
    </div>
  );
}
