import { useEffect, useRef, useState } from "react";

/**
 * Buffers streamed text and reveals it word-by-word at a consistent pace,
 * smoothing out network bursts from the SSE stream.
 *
 * For non-streaming messages (loaded from localStorage), returns the
 * full text immediately with no buffering.
 */
export function useStreamedText(fullText: string, isActive: boolean): string {
	const [displayedLength, setDisplayedLength] = useState(
		isActive ? 0 : fullText.length,
	);

	// Track whether this message was ever streamed. Streaming messages start
	// with isActive=true; localStorage messages start with false. The ref
	// captures the initial value so the buffer keeps draining word-by-word
	// even after isActive becomes false (stream ended).
	const isStreamingRef = useRef(isActive);

	useEffect(() => {
		// Non-streaming messages (e.g. loaded from localStorage) are shown
		// in full via the initial state value — nothing to animate.
		if (fullText.length === 0 || !isStreamingRef.current) return;

		const target = fullText.length;

		const interval = setInterval(() => {
			setDisplayedLength((prev) => {
				if (prev >= target) {
					clearInterval(interval);
					return prev;
				}

				// Advance to the end of the next word
				let next = prev;
				while (next < target && /\s/.test(fullText[next])) next++;
				while (next < target && !/\s/.test(fullText[next])) next++;

				return Math.min(next, target);
			});
		}, 25);

		return () => clearInterval(interval);
	}, [fullText]);

	return fullText.slice(0, displayedLength);
}
