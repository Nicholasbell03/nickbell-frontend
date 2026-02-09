import { useCallback, useRef, useState } from "react";

export function useFadeInOnScroll(threshold = 0.15) {
	const observerRef = useRef<IntersectionObserver | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	const callbackRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (observerRef.current) {
				observerRef.current.disconnect();
				observerRef.current = null;
			}

			if (!node || isVisible) return;

			observerRef.current = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						setIsVisible(true);
						observerRef.current?.disconnect();
						observerRef.current = null;
					}
				},
				{ threshold },
			);

			observerRef.current.observe(node);
		},
		[threshold, isVisible],
	);

	const fadeInClass = isVisible
		? "opacity-100 translate-y-0"
		: "opacity-0 translate-y-8";

	return [
		callbackRef,
		`transition-all duration-1000 ease-out ${fadeInClass}`,
	] as const;
}
