import { useState, useEffect, useRef } from 'react';

interface UseTypewriterOptions {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  delayBetweenWords?: number;
  loop?: boolean;
  paused?: boolean;
}

export const useTypewriter = ({
  words,
  typeSpeed = 100,
  deleteSpeed = 50,
  delayBetweenWords = 2000,
  loop = true,
  paused = false,
}: UseTypewriterOptions) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (words.length === 0 || paused) return;

    const currentWord = words[wordIndex];

    const handleTyping = () => {
      if (isPaused) {
        timeoutRef.current = setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, delayBetweenWords);
        return;
      }

      if (!isDeleting) {
        if (text.length < currentWord.length) {
          setText(currentWord.slice(0, text.length + 1));
          timeoutRef.current = setTimeout(handleTyping, typeSpeed);
        } else {
          setIsPaused(true);
          timeoutRef.current = setTimeout(handleTyping, delayBetweenWords);
        }
      } else {
        if (text.length > 0) {
          setText(currentWord.slice(0, text.length - 1));
          timeoutRef.current = setTimeout(handleTyping, deleteSpeed);
        } else {
          setIsDeleting(false);
          const nextIndex = (wordIndex + 1) % words.length;
          if (nextIndex === 0 && !loop) {
            return;
          }
          setWordIndex(nextIndex);
        }
      }
    };

    timeoutRef.current = setTimeout(handleTyping, isDeleting ? deleteSpeed : typeSpeed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, wordIndex, isDeleting, isPaused, words, typeSpeed, deleteSpeed, delayBetweenWords, loop, paused]);

  return text;
};
