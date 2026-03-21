export function ThinkingIndicator() {
	return (
		<div
			className="flex items-center gap-3 px-4 py-3 mb-4 animate-fade-in"
			role="status"
			aria-label="Thinking..."
		>
			<div className="relative h-8 w-8 shrink-0">
				<div className="animate-orbit h-full w-full">
					<span className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-emerald-400" />
					<span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
					<span className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-emerald-400/30" />
				</div>
			</div>
			<span className="text-sm text-slate-400 flex items-center gap-0.5">
				Thinking
				<span className="animate-thinking-dot-1">.</span>
				<span className="animate-thinking-dot-2">.</span>
				<span className="animate-thinking-dot-3">.</span>
			</span>
		</div>
	);
}
