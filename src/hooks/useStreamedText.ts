import { useEffect, useState } from "react";

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

	useEffect(() => {
		if (fullText.length === 0) return;

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
		}, 40);

		return () => clearInterval(interval);
	}, [fullText]);

	return fullText.slice(0, displayedLength);
}
