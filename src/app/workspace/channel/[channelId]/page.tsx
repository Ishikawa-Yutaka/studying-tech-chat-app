'use client';

// Next.js
import { useParams, notFound } from 'next/navigation';
// 自作コンポーネント
import ChannelHeader from '@/components/channel/channelHeader';
import MessageView from '@/components/channel/messageView';
// データ
import { getChannel, getChannelMessages, MY_USER_ID } from '@/data/workspace';

export default function ChannelPage() {
  // URL のパスからチャンネル ID を取得
  const { channelId } = useParams<{ channelId: string }>();
  const channelIdNumber = parseInt(channelId, 10);
  if (isNaN(channelIdNumber)) return notFound();

  const channel = getChannel(channelIdNumber);
  if (!channel) return notFound();

  return (
    <div className="flex flex-col h-full">
      <ChannelHeader channel={channel} />
      <MessageView messages={getChannelMessages(channelIdNumber)} myUserId={MY_USER_ID} />
    </div>
  );
}
