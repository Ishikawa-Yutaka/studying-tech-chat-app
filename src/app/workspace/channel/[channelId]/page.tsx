'use client';

// React
import { useState, useEffect } from 'react';
// Next.js
import { useParams, notFound } from 'next/navigation';
// 自作コンポーネント
import ChannelHeader from '@/components/channel/channelHeader';
import MessageView from '@/components/channel/messageView';
import MessageForm from '@/components/channel/messageForm';
// データ
import { getChannel, getChannelMessages, getDirectMessagePartner, getUser, MY_USER_ID } from '@/data/workspace';
// 型
import { ChannelType, Message, Channel } from '@/types/workspace';

export default function ChannelPage() {
  // React Hooks は常に同じ順序で呼び出される必要があり、条件分岐やアーリーリターンの後で呼び出すことはできません
  const [messages, setMessages] = useState<Message[]>([]);

  // URL のパスからチャンネル ID を取得
  const { channelId } = useParams<{ channelId: string }>();
  const channelIdNumber = parseInt(channelId, 10);
  let channel: Channel | null = null;

  // getChannel はチャンネルが見つからなかった場合に error を throw する。
  // そのため、エラーが起こっても処理を止めないように try-catch で囲む
  try {
    channel = getChannel(channelIdNumber);
  } catch (error) {
    console.error(error);
  }

  useEffect(() => {
    // setMessages は、コンポーネントのレンダリングの度に実行されるので、無限ループにならないように、 useEffect 内で実行する
    // useEffect の依存配列に channelIdNumber を含めることで、チャンネル ID が変更された時にのみ実行する
    setMessages(getChannelMessages(channelIdNumber));
  }, [channelIdNumber]);

  if (!channel) return notFound();

  const channelDisplayName =
    channel.channelType === ChannelType.CHANNEL
      ? `#${channel.name}`
      : getDirectMessagePartner(channel, MY_USER_ID).name;

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      channel: channel,
      sender: getUser(MY_USER_ID),
      content: content,
      createdAt: new Date(),
    };

    // push で追加せず、スプレッド演算子で配列を展開する形で新しいメッセージを追加する
    // これは、 React の state が immutable (不変) であるため
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      <ChannelHeader channel={channel} />
      {/* メッセージの内容が useState で管理されているので、それを渡す */}
      <MessageView messages={messages} myUserId={MY_USER_ID} />
      <MessageForm channelDisplayName={channelDisplayName} handleSendMessage={handleSendMessage} />
    </div>
  );
}
