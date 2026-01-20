import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-4 mb-6 animate-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className={`h-10 w-10 flex-shrink-0 ${isUser ? 'ring-2 ring-blue-500/30' : 'ring-2 ring-cyan-500/30'}`}>
        <AvatarFallback className={`${isUser ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-slate-700 to-slate-600'} text-white text-sm font-semibold`}>
          {isUser ? 'N' : <Bot className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>

      <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`rounded-2xl px-5 py-3 backdrop-blur-sm ${
          isUser
            ? 'bg-gradient-to-br from-blue-600/90 to-cyan-600/90 text-white ml-auto'
            : 'bg-slate-800/90 text-slate-200 border border-slate-700/50'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    </div>
  );
};
