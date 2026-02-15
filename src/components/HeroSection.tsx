import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ChevronDown, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useChatContext } from "@/context/ChatContext";

const PLACEHOLDER_QUESTIONS = [
	"What's Nick's latest blog post about?",
	"What qualifications does Nick have?",
	"Give me a list of projects Nick worked on.",
];

export const HeroSection = () => {
	const [query, setQuery] = useState("");
	const [pendingQuery, setPendingQuery] = useState<string | null>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const { messages, sendMessage, clearChat, openPanel, setHeroInputVisible } =
		useChatContext();

	const placeholderText = useTypewriter({
		words: PLACEHOLDER_QUESTIONS,
		typeSpeed: 80,
		deleteSpeed: 40,
		delayBetweenWords: 2000,
		loop: true,
	});

	// Track hero input visibility with IntersectionObserver
	useEffect(() => {
		const form = formRef.current;
		if (!form) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setHeroInputVisible(entry.isIntersecting);
			},
			{ threshold: 0.5 },
		);

		observer.observe(form);
		return () => {
			observer.disconnect();
			setHeroInputVisible(false);
		};
	}, [setHeroInputVisible]);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (!query.trim()) return;

			if (messages.length > 0) {
				setPendingQuery(query.trim());
				setQuery("");
				return;
			}

			sendMessage(query.trim());
			openPanel();
			setQuery("");
		},
		[query, messages.length, sendMessage, openPanel],
	);

	const handleNewConversation = useCallback(() => {
		if (!pendingQuery) return;
		clearChat();
		sendMessage(pendingQuery);
		openPanel();
		setPendingQuery(null);
	}, [pendingQuery, clearChat, sendMessage, openPanel]);

	const handleContinue = useCallback(() => {
		if (!pendingQuery) return;
		sendMessage(pendingQuery);
		openPanel();
		setPendingQuery(null);
	}, [pendingQuery, sendMessage, openPanel]);

	const handleDismiss = useCallback(() => {
		setPendingQuery(null);
	}, []);

	return (
		<div className="relative min-h-screen flex flex-col px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900/50 to-slate-950"></div>

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
							I'm a full stack developer specialising in building
							intelligent, user-centric applications with modern
							web technologies and AI integration.
						</p>
					</div>
				</div>

				<form
					ref={formRef}
					onSubmit={handleSubmit}
					className="w-full max-w-3xl animate-fade-in-delay"
				>
					<div className="relative group">
						<div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
						<div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-500/20 overflow-hidden">
							<Search className="absolute left-5 h-5 w-5 text-emerald-400" />
							<input
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder={placeholderText}
								enterKeyHint="send"
								className="w-full py-5 pl-14 pr-14 bg-transparent text-slate-200 placeholder:text-slate-500 focus:outline-none text-lg"
							/>
							<div className="absolute right-5 flex items-center">
								{query.trim() ? (
									<button
										type="submit"
										className="p-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white transition-colors"
										aria-label="Send message"
									>
										<ArrowRight className="h-4 w-4" />
									</button>
								) : (
									<div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
								)}
							</div>
						</div>
					</div>
				</form>

				{pendingQuery && (
					<div className="w-full max-w-3xl animate-fade-in">
						<div className="rounded-xl bg-slate-900/90 backdrop-blur-xl border border-emerald-500/20 px-5 py-4">
							<p className="text-sm text-slate-300 mb-3">
								You have an existing conversation. Would you
								like to continue it or start fresh?
							</p>
							<div className="flex gap-3">
								<button
									onClick={handleContinue}
									className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
								>
									Continue chat
								</button>
								<button
									onClick={handleNewConversation}
									className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50 transition-colors"
								>
									New conversation
								</button>
								<button
									onClick={handleDismiss}
									className="px-3 py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
									aria-label="Dismiss"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}

				<div className="absolute bottom-10 animate-bounce">
					<ChevronDown className="h-6 w-6 text-emerald-500/50" />
				</div>
			</div>
		</div>
	);
};
