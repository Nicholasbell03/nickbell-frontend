import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, ChevronDown, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useChatContext } from "@/context/ChatContext";

const SUGGESTIONS = [
	"What's Nick's latest blog post about?",
	"What qualifications does Nick have?",
	"Give me a list of projects Nick worked on.",
	"What is Nick's tech stack?",
	"Tell me about Nick's experience with AI.",
	"What programming languages does Nick know?",
	"What's Nick's professional background?",
	"What frameworks does Nick specialise in?",
	"Tell me about Nick's work with Laravel.",
	"What frontend technologies does Nick use?",
	"Has Nick written about React or TypeScript?",
	"What kind of applications does Nick build?",
	"Summarise Nick's most recent project.",
	"Does Nick have any shared links or resources?",
	"How can I get in touch with Nick?",
];

const TYPEWRITER_QUESTIONS = SUGGESTIONS.slice(0, 3);

function filterSuggestions(
	query: string,
	suggestions: string[],
	max = 4,
): string[] {
	const trimmed = query.trim().toLowerCase();
	if (!trimmed) return suggestions.slice(0, max);
	const words = trimmed.split(/\s+/);

	return suggestions
		.filter((s) => {
			const lower = s.toLowerCase();
			return words.every((w) => lower.includes(w));
		})
		.slice(0, max);
}

export const HeroSection = () => {
	const [query, setQuery] = useState("");
	const [pendingQuery, setPendingQuery] = useState<string | null>(null);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [focusedIndex, setFocusedIndex] = useState(-1);
	const formRef = useRef<HTMLFormElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const { messages, sendMessage, clearChat, openPanel, isPanelOpen, setHeroInputVisible } =
		useChatContext();

	const placeholderText = useTypewriter({
		words: TYPEWRITER_QUESTIONS,
		typeSpeed: 80,
		deleteSpeed: 40,
		delayBetweenWords: 2000,
		loop: true,
		paused: isPanelOpen,
	});

	const filteredSuggestions = useMemo(
		() => filterSuggestions(query, SUGGESTIONS),
		[query],
	);

	// Close suggestions on outside click
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(e.target as Node)
			) {
				setShowSuggestions(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

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

			setShowSuggestions(false);

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

	const handleSuggestionSelect = useCallback(
		(value: string) => {
			setShowSuggestions(false);

			if (messages.length > 0) {
				setPendingQuery(value);
				setQuery(value);
				return;
			}

			sendMessage(value);
			openPanel();
		},
		[messages.length, sendMessage, openPanel],
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

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (!showSuggestions || filteredSuggestions.length === 0) return;

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setFocusedIndex((prev) =>
						prev < filteredSuggestions.length - 1 ? prev + 1 : 0,
					);
					break;
				case "ArrowUp":
					e.preventDefault();
					setFocusedIndex((prev) =>
						prev > 0 ? prev - 1 : filteredSuggestions.length - 1,
					);
					break;
				case "Enter":
					if (focusedIndex >= 0) {
						e.preventDefault();
						handleSuggestionSelect(
							filteredSuggestions[focusedIndex],
						);
					}
					break;
				case "Escape":
					setShowSuggestions(false);
					setFocusedIndex(-1);
					break;
			}
		},
		[
			showSuggestions,
			filteredSuggestions,
			focusedIndex,
			handleSuggestionSelect,
		],
	);

	return (
		<div className="relative min-h-[calc(100vh-4rem)] flex flex-col px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900/50 to-slate-950"></div>

			<div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-8 max-w-4xl w-full mx-auto py-20">
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
					<div
						ref={wrapperRef}
						className="relative"
						role="combobox"
						aria-expanded={showSuggestions && filteredSuggestions.length > 0}
						aria-haspopup="listbox"
						aria-owns="suggestions-listbox"
						aria-controls="suggestions-listbox"
					>
						<div className="relative group">
							<div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
							<div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-500/20 overflow-hidden">
								<Search className="absolute left-5 h-5 w-5 text-emerald-400" />
								<input
									type="text"
									value={query}
									onChange={(e) => {
										setQuery(e.target.value);
										setFocusedIndex(-1);
									}}
									onFocus={() =>
										setShowSuggestions(true)
									}
									onKeyDown={handleKeyDown}
									placeholder={placeholderText}
									enterKeyHint="send"
									role="searchbox"
									aria-label="Ask sudo about Nick"
									aria-activedescendant={
										focusedIndex >= 0
											? `suggestion-${focusedIndex}`
											: undefined
									}
									aria-controls="suggestions-listbox"
									aria-autocomplete="list"
									className="w-full py-5 pl-14 pr-14 bg-transparent text-slate-200 placeholder:text-slate-500 focus:outline-none text-lg"
								/>
								<button
									type="submit"
									disabled={!query.trim()}
									className={`absolute right-5 p-1.5 rounded-full transition-all ${
										query.trim()
											? "bg-emerald-500 hover:bg-emerald-400 text-white opacity-100"
											: "bg-emerald-500/20 text-emerald-500/40 opacity-0 pointer-events-none"
									}`}
									aria-label="Send message"
								>
									<ArrowRight className="h-4 w-4" />
								</button>
							</div>
						</div>
						{showSuggestions && filteredSuggestions.length > 0 && (
							<ul
								id="suggestions-listbox"
								role="listbox"
								className="absolute w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 rounded-xl shadow-2xl max-h-[min(220px,30vh)] overflow-y-auto z-50"
							>
								{filteredSuggestions.map((suggestion, i) => (
									<li
										key={suggestion}
										id={`suggestion-${i}`}
										role="option"
										aria-selected={i === focusedIndex}
										onMouseDown={(e) => {
											e.preventDefault();
											handleSuggestionSelect(
												suggestion,
											);
										}}
										onMouseEnter={() =>
											setFocusedIndex(i)
										}
										className={`flex items-center gap-3 px-4 py-3 cursor-pointer select-none ${
											i === focusedIndex
												? "bg-emerald-500/10"
												: ""
										}`}
									>
										<Search
											className={`h-4 w-4 shrink-0 ${
												i === focusedIndex
													? "text-emerald-400"
													: "text-slate-500"
											}`}
										/>
										<span
											className={
												i === focusedIndex
													? "text-emerald-300"
													: "text-slate-300"
											}
										>
											{suggestion}
										</span>
									</li>
								))}
							</ul>
						)}
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

				{!showSuggestions && (
					<div className="absolute bottom-10 animate-bounce">
						<ChevronDown className="h-6 w-6 text-emerald-500/50" />
					</div>
				)}
			</div>
		</div>
	);
};
