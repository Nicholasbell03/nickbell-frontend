import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTypewriter } from '@/hooks/useTypewriter';
import { ChatMessage } from '@/components/ChatMessage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// TODO: Fetch suggested questions from API
const PLACEHOLDER_QUESTIONS = [
  "What's Nick's latest blog post about?",
  "What qualifications does Nick have?",
  "Give me a list of projects Nick worked on.",
];

// TODO: Connect to AI chat backend API
const AI_OFFLINE_MESSAGE = "I'm currently offline and can't process your request right now. This is a demo portfolio showcasing the chat interface design. In a production environment, I would connect to an AI service to provide real answers about Nick's work, projects, and qualifications.";

export const HeroSection = () => {
  const [isChatMode, setIsChatMode] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const placeholderText = useTypewriter({
    words: PLACEHOLDER_QUESTIONS,
    typeSpeed: 80,
    deleteSpeed: 40,
    delayBetweenWords: 2000,
    loop: true,
  });

  const handleExitChat = useCallback(() => {
    setIsChatMode(false);
    setMessages([]);
    setQuery('');
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isChatMode) {
        handleExitChat();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isChatMode, handleExitChat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages([...messages, userMessage]);
    setIsChatMode(true);
    setQuery('');

    // TODO: Replace with actual AI API call
    setTimeout(() => {
      const aiMessage: Message = {
        role: 'assistant',
        content: AI_OFFLINE_MESSAGE,
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 800);
  };

  return (
    <div className="relative min-h-screen flex flex-col px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/50 to-slate-950"></div>

      {isChatMode ? (
        <div className="relative z-10 flex flex-col h-screen max-w-4xl w-full mx-auto">
          <button
            onClick={handleExitChat}
            className="absolute top-6 right-0 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm border border-slate-700/50 transition-all duration-200 group z-20"
            aria-label="Exit chat mode"
          >
            <X className="h-5 w-5 text-slate-400 group-hover:text-slate-200" />
          </button>

          <div className="pt-6 pb-4">
            <form onSubmit={handleSubmit} className="w-full animate-fade-in">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
                <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/50 overflow-hidden">
                  <Search className="absolute left-5 h-5 w-5 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a follow-up question..."
                    className="w-full py-4 pl-14 pr-5 bg-transparent text-slate-200 placeholder:text-slate-500 focus:outline-none text-base"
                    autoFocus
                  />
                  <div className="absolute right-5 flex items-center">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-2 py-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
          >
            {messages.map((message, index) => (
              <ChatMessage key={index} role={message.role} content={message.content} />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-8 max-w-4xl w-full mx-auto py-20">
          <div className="flex flex-col items-center space-y-6 animate-fade-in">
            <Avatar className="h-20 w-20 ring-2 ring-blue-500/30 ring-offset-4 ring-offset-slate-950">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-2xl font-semibold">
                N
              </AvatarFallback>
            </Avatar>

            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Hi, I'm Nick.
              </h1>
              <p className="text-xl md:text-2xl font-light text-slate-300">
                I'm a full stack developer.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-3xl animate-fade-in-delay">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
              <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/50 overflow-hidden">
                <Search className="absolute left-5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholderText}
                  className="w-full py-5 pl-14 pr-5 bg-transparent text-slate-200 placeholder:text-slate-500 focus:outline-none text-lg"
                />
                <div className="absolute right-5 flex items-center">
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </form>

          <div className="absolute bottom-10 animate-bounce">
            <ChevronDown className="h-6 w-6 text-slate-500" />
          </div>
        </div>
      )}
    </div>
  );
};
