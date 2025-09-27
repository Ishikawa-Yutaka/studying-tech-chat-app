'use client';

// Next.js
import Link from 'next/link';
// アイコン
import { Bot } from 'lucide-react';
// shadcn/ui
import { Button } from '@/components/ui/button';

export default function AiChatList({ pathname }: { pathname: string }) {
  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">生成 AI</h2>
      </div>

      <div className="space-y-1 mt-2">
        <Button
          variant={pathname === `/workspace/ai-chat` ? 'secondary' : 'ghost'}
          className="w-full justify-start gap-2"
          asChild
        >
          <Link href="/workspace/ai-chat">
            <Bot className="h-4 w-4" />
            AI チャット
          </Link>
        </Button>
      </div>
    </div>
  );
}
