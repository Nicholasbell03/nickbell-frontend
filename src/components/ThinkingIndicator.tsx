export function ThinkingIndicator() {
	return (
		<div className="flex mb-4 justify-start animate-fade-in">
			<div className="max-w-[85%] flex flex-col items-start">
				<div className="rounded-2xl px-5 py-3 backdrop-blur-sm bg-slate-800/90 border border-slate-700/50 w-64">
					<div className="space-y-2.5">
						<div className="h-3 rounded-full bg-slate-700/50 w-3/4 shimmer" />
						<div className="h-3 rounded-full bg-slate-700/50 w-1/2 shimmer" />
						<div className="h-3 rounded-full bg-slate-700/50 w-2/5 shimmer" />
					</div>
				</div>
			</div>
		</div>
	);
}
