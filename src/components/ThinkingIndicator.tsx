import { ThinkingRobot } from "./ThinkingRobot";

export function ThinkingIndicator() {
	return (
		<div
			className="flex items-center gap-3 px-4 py-3 mb-4 animate-fade-in"
			role="status"
			aria-label="Thinking..."
		>
			<div className="animate-thinking-bob">
				<ThinkingRobot className="text-emerald-500" size={36} />
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
