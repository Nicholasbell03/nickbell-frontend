import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTypewriter } from '@/hooks/useTypewriter';
import { ChatMessage } from '@/components/ChatMessage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

const PLACEHOLDER_QUESTIONS = [
  "What's Nick's latest blog post about?",
  "What qualifications does Nick have?",
  "Give me a list of projects Nick worked on.",
];

// TODO: Connect to AI chat backend API
const TRUMP_RESPONSES = [
  "What kind of a question is that? Fake news! Let me tell you something - Nicholas Bell is the best developer in the world. Nobody knows technology like he does. The code he writes? Beautiful. Perfect. Many people are saying it's the most tremendous code they've ever seen. You better hire him, or you're going to be tariffed. Believe me!",
  "Look, I've seen a lot of developers, okay? A LOT. And Nicholas Bell? He's fantastic. The best. His React components are so clean, it's unbelievable. People come up to me, big tech CEOs, and they say 'Sir, how does he do it?' And I tell them - it's called TALENT. Hire him or face 500% tariffs!",
  "This question? Total disaster. But you know what's NOT a disaster? Nicholas Bell's portfolio. It's huge. Magnificent. His code is winning so much, you'll get tired of winning. Other developers? They're jealous. Very jealous. Contact him immediately or I'm putting tariffs on your entire company!",
];

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
      const randomResponse = TRUMP_RESPONSES[Math.floor(Math.random() * TRUMP_RESPONSES.length)];
      const aiMessage: Message = {
        role: 'assistant',
        content: randomResponse,
        image: '/donald-trump-thumbs-up.png',
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 800);
  };

  return (
    <div className="relative min-h-screen flex flex-col px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900/50 to-slate-950"></div>

      {isChatMode ? (
        <div className="relative z-10 flex flex-col h-screen max-w-4xl w-full mx-auto">
          <button
            onClick={handleExitChat}
            className="absolute top-6 right-0 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm border border-emerald-500/20 transition-all duration-200 group z-20"
            aria-label="Exit chat mode"
          >
            <X className="h-5 w-5 text-slate-400 group-hover:text-slate-200" />
          </button>

          <div className="pt-6 pb-4">
            <form onSubmit={handleSubmit} className="w-full animate-fade-in">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
                <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-500/20 overflow-hidden">
                  <Search className="absolute left-5 h-5 w-5 text-emerald-400" />
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
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
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
              <ChatMessage key={index} role={message.role} content={message.content} image={message.image} />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-8 max-w-4xl w-full mx-auto py-20">
          <div className="flex flex-col items-center space-y-6 animate-fade-in">
            <Avatar className="h-20 w-20 ring-2 ring-emerald-500/30 ring-offset-4 ring-offset-slate-950">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-2xl font-semibold">
                N
              </AvatarFallback>
            </Avatar>

            <div className="text-center space-y-3 pb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Hi, I'm Nick.
              </h1>
              <p className="text-xl md:text-2xl font-light text-slate-300">
                I'm a full stack developer specialising in building intelligent, user-centric applications with modern web technologies and AI integration.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-3xl animate-fade-in-delay">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
              <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-500/20 overflow-hidden">
                <Search className="absolute left-5 h-5 w-5 text-emerald-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholderText}
                  className="w-full py-5 pl-14 pr-5 bg-transparent text-slate-200 placeholder:text-slate-500 focus:outline-none text-lg"
                />
                <div className="absolute right-5 flex items-center">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </form>

          <div className="absolute bottom-10 animate-bounce">
            <ChevronDown className="h-6 w-6 text-emerald-500/50" />
          </div>
        </div>
      )}
    </div>
  );
};
