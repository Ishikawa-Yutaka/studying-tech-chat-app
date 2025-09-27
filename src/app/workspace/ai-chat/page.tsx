'use client';

// React
import { useState, useEffect } from 'react';
// アイコン
import { Send } from 'lucide-react';
// shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
// 型
import { AiChatRole, AiChatMessage, AiChatRecord } from '@/types/workspace';
// データ
import { AI_CHAT_DAILY_USAGE_LIMIT } from '@/lib/db';

export default function WorkspaceAIChatPage() {
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<AiChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [remainingUsage, setRemainingUsage] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 残り使用回数を取得
  const fetchRemainingUsage = async () => {
    try {
      const res = await fetch('/api/ai-chat/remaining');
      const data = await res.json();

      if (res.ok) setRemainingUsage(data.remaining);
    } catch (error) {
      console.error('残り回数の取得に失敗しました:', error);
    }
  };

  // 会話履歴を取得
  const fetchChatHistory = async () => {
    try {
      const res = await fetch('/api/ai-chat/history');
      const data = await res.json();

      if (res.ok && data.chats) {
        // データベースから取得した履歴をフォーマットして設定
        const formattedHistory = data.chats.flatMap((chat: AiChatRecord) => [
          { role: AiChatRole.USER, content: chat.message },
          { role: AiChatRole.ASSISTANT, content: chat.response },
        ]);
        setChatHistory(formattedHistory);
      }
    } catch (error) {
      console.error('履歴の取得に失敗しました:', error);
    }
  };

  useEffect(() => {
    fetchRemainingUsage();
    fetchChatHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setError(null);
    setChatHistory((prev) => [...prev, { role: AiChatRole.USER, content: message }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (res.ok) {
        // AI の応答をチャット履歴に追加
        setChatHistory((prev) => [...prev, { role: AiChatRole.ASSISTANT, content: data.response }]);

        // 残り使用回数を更新
        if (data.remainingToday !== undefined) setRemainingUsage(data.remainingToday);
      } else {
        setError(data.error || 'エラーが発生しました');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('メッセージの送信に失敗しました');
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <header className="flex items-center px-6 py-3 h-14 border-b">
        <h1 className="text-xl font-semibold">AI チャット</h1>
        {remainingUsage !== null && (
          <div className="ml-4 text-sm text-muted-foreground">
            本日の残り利用回数: <span className="font-medium">{remainingUsage}</span> / {AI_CHAT_DAILY_USAGE_LIMIT}
          </div>
        )}
      </header>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* エラーメッセージ */}
        {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

        {/* チャット履歴 */}
        <ScrollArea className="flex-1 m-4 p-4 bg-muted/50 rounded-lg">
          {chatHistory.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">AI に質問をしてみましょう</p>
            </div>
          ) : (
            <div className="space-y-4">
              {chatHistory.map((chat, index) => (
                <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      chat.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    {chat.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-4 py-2 rounded-lg bg-muted">
                    <span>考え中...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* 入力フォーム */}
        <footer onSubmit={handleSubmit} className="border-t bg-background p-4">
          <form className="flex items-center gap-4">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
              placeholder="メッセージを入力..."
              disabled={isLoading}
            />
            {/* disabled 属性で、メッセージが空の場合はボタンを無効化する */}
            <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
              <Send className="h-5 w-5" />
              <span className="sr-only">送信</span>
            </Button>
          </form>
        </footer>
      </div>
    </div>
  );
}
