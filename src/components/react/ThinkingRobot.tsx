interface ThinkingRobotProps {
	className?: string;
	size?: number;
}

export function ThinkingRobot({ className = "", size = 36 }: ThinkingRobotProps) {
	return (
		<svg
			viewBox="0 0 48 48"
			width={size}
			height={size}
			fill="none"
			className={className}
			aria-hidden="true"
		>
			{/* Robot head group (static) */}
			<g>
				{/* Antenna line */}
				<line x1="20" y1="14" x2="20" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				{/* Antenna tip (pulsing) */}
				<circle cx="20" cy="7" r="2.5" fill="currentColor" className="animate-thinking-antenna" style={{ transformOrigin: "20px 7px" }} />

				{/* Head */}
				<rect x="8" y="14" width="24" height="20" rx="4" stroke="currentColor" strokeWidth="2" />

				{/* Left eye */}
				<circle cx="16" cy="24" r="2.5" fill="currentColor" />
				{/* Right eye */}
				<circle cx="24" cy="24" r="2.5" fill="currentColor" />

				{/* Smile */}
				<path d="M15 29 Q20 33 25 29" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
			</g>

			{/* Thought bubble group (pulsing opacity) */}
			<g className="animate-thinking-bubble">
				{/* Trail dots */}
				<circle cx="34" cy="16" r="1.5" fill="currentColor" />
				<circle cx="37" cy="12" r="2" fill="currentColor" />
				{/* Cloud cluster */}
				<circle cx="40" cy="6" r="3" fill="currentColor" />
				<circle cx="44" cy="7" r="2.5" fill="currentColor" />
				<circle cx="42" cy="4" r="2" fill="currentColor" />
			</g>

			{/* Scratch arm group (intermittent) */}
			<g className="animate-thinking-scratch" style={{ transformOrigin: "32px 34px" }}>
				{/* Arm path */}
				<path
					d="M32 34 Q36 30 38 26 Q39 24 40 22"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					fill="none"
				/>
				{/* Hand */}
				<circle cx="40" cy="21" r="2" fill="currentColor" />
			</g>
		</svg>
	);
}
