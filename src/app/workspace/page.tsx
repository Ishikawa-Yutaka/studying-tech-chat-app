'use client';

// React
import { useState } from 'react';
// Next.js
import Link from 'next/link';
// アイコン
import { Hash, MessageSquare, Users } from 'lucide-react';
// shadcn/ui
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// 自作コンポーネント
import CreateChannelModal from '@/components/workspace/createChannelModal';
import CreateDirectMessageModal from '@/components/workspace/createDirectMessageModal';
// 型
import { ChannelType } from '@/types/workspace';
// データ
import { MY_USER_ID, users, channels, messages, getDirectMessagePartner } from '@/data/workspace';

export default function WorkSpacePage() {
  const [isChannelModalOpen, setIsChannelModalOpen] = useState<boolean>(false);
  const [isDmModalOpen, setIsDmModalOpen] = useState<boolean>(false);

  const channelsWithMe = channels.filter((channel) => channel.members.some((member) => member.id === MY_USER_ID));
  const normalChannels = channelsWithMe.filter((channel) => channel.channelType === ChannelType.CHANNEL);
  const directMessages = channelsWithMe.filter((channel) => channel.channelType === ChannelType.DM);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">ダッシュボード</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsDmModalOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            新規 DM
          </Button>
          <Button size="sm" onClick={() => setIsChannelModalOpen(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            新規チャンネル
          </Button>
        </div>
      </div>

      <CreateChannelModal isOpen={isChannelModalOpen} onOpenChange={setIsChannelModalOpen} />
      <CreateDirectMessageModal isOpen={isDmModalOpen} onOpenChange={setIsDmModalOpen} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">チャンネル・DM</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{channelsWithMe.length}</div>
            <p className="text-xs text-muted-foreground">参加しているチャンネル・DM 数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">メッセージ</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {messages.filter((message) => message.sender.id === MY_USER_ID).length}
            </div>
            <p className="text-xs text-muted-foreground">自分が投稿したメッセージ数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">メンバー</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">ワークスペース全体のメンバー数</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>チャンネル一覧</CardTitle>
            <CardDescription>自分が参加しているチャンネル一覧</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {normalChannels.map((channel) => (
                <div key={channel.id} className="flex items-center">
                  <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Hash className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <Link href={`/workspace/channel/${channel.id}`} className="font-medium hover:underline">
                      {channel.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{channel.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>DM 一覧</CardTitle>
            <CardDescription>自分が参加している DM 一覧</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {directMessages.map((dm) => (
                <div key={dm.id} className="flex items-center">
                  <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <span className="font-medium text-primary">
                      {getDirectMessagePartner(dm, MY_USER_ID).name.charAt(0)}
                    </span>
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <Link href={`/workspace/channel/${dm.id}`} className="font-medium hover:underline">
                        {getDirectMessagePartner(dm, MY_USER_ID).name}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
