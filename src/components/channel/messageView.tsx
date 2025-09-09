import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Message } from '@/types/workspace';

export default function MessageView({ messages, myUserId }: { messages: Message[]; myUserId: number }) {
  // アロー関数で、メッセージが自分のものかどうかを判断する処理を定義
  const isMyMessage = (message: Message) => message.sender.id === myUserId;

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4 py-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-4 ${isMyMessage(message) ? 'justify-end' : ''}`}>
            {!isMyMessage(message) && (
              <Avatar>
                <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}

            <div className="grid gap-1">
              <div className={`flex items-center gap-2 ${isMyMessage(message) ? 'justify-end' : ''}`}>
                {!isMyMessage(message) && <span className="font-semibold">{message.sender.name}</span>}
                <span className="text-xs text-muted-foreground">{message.createdAt.toLocaleString()}</span>
                {isMyMessage(message) && <span className="font-semibold">自分</span>}
              </div>
              <div
                className={`px-4 py-2 rounded-lg ${
                  isMyMessage(message) ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>

            {isMyMessage(message) && (
              <Avatar>
                <AvatarFallback>自</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
