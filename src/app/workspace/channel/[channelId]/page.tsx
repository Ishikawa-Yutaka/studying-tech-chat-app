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
import { getChannel, getDirectMessagePartner, getUser, MY_USER_ID } from '@/data/workspace';
// 型
import { ChannelType, Message, Channel } from '@/types/workspace';
// Zustand ストア
import { useMessageStore } from '@/store/useMessageStore';

export default function ChannelPage() {
  // URL のパスからチャンネル ID を取得
  const { channelId } = useParams<{ channelId: string }>();
  const channelIdNumber = parseInt(channelId, 10);
  let channel: Channel | null = null;

  // Zustand ストアからメッセージとアクションを取得
  const { messages, fetchMessages, addMessage } = useMessageStore();

  // getChannel はチャンネルが見つからなかった場合に error を throw する。
  // そのため、エラーが起こっても処理を止めないように try-catch で囲む
  try {
    channel = getChannel(channelIdNumber);
  } catch (error) {
    console.error(error);
  }

  useEffect(() => {
    // チャンネル ID が変更されたときにメッセージを取得
    fetchMessages(channelIdNumber);
  }, [channelIdNumber, fetchMessages]);

  if (!channel) return notFound();

  const channelDisplayName =
    channel.channelType === ChannelType.CHANNEL
      ? `# ${channel.name}`
      : getDirectMessagePartner(channel, MY_USER_ID).name;

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      channel: channel,
      sender: getUser(MY_USER_ID),
      content: content,
      createdAt: new Date(),
    };

    // Zustand ストアにメッセージを追加
    addMessage(newMessage);
  };

  return (
    <div className="flex flex-col h-full">
      <ChannelHeader channel={channel} />
      <MessageView messages={messages} myUserId={MY_USER_ID} />
      <MessageForm channelDisplayName={channelDisplayName} handleSendMessage={handleSendMessage} />
    </div>
  );
}
