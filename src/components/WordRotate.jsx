import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const DEFAULT_WORDS = [
  "BIOINFORMATICIAN",
  "GENOME SCIENTIST",
  "FINAL YEAR UNDERGRAD",
  "COMPUTATIONAL BIOLOGIST",
];
const DEFAULT_INTERVAL = 1350;
const WORD_TRANSITION = { duration: 0.4, ease: "easeInOut" };
const WORD_STYLE_CLASSES = {
  bioinformatician: "word-rotate__word--bioinformatics",
  "genome scientist": "word-rotate__word--genome",
  "final year undergrad": "word-rotate__word--undergrad",
  "computational biologist": "word-rotate__word--computational",
};

function getWordClassName(word, baseClassName) {
  const styleClassName = WORD_STYLE_CLASSES[String(word).toLowerCase()];
  return [baseClassName, styleClassName].filter(Boolean).join(" ");
}

export function WordRotate({
  words = DEFAULT_WORDS,
  interval = DEFAULT_INTERVAL,
}) {
  const safeWords = words.length > 0 ? words : DEFAULT_WORDS;
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const word = safeWords[index % safeWords.length];

  const advance = useCallback(() => {
    setIndex((currentIndex) => (currentIndex + 1) % safeWords.length);
  }, [safeWords.length]);

  useEffect(() => {
    if (shouldReduceMotion || safeWords.length < 2) return undefined;

    const timeoutId = window.setTimeout(advance, interval);
    return () => window.clearTimeout(timeoutId);
  }, [advance, index, interval, safeWords.length, shouldReduceMotion]);

  const initialState = shouldReduceMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: "100%" };
  const exitState = shouldReduceMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: "-100%" };
  const transition = shouldReduceMotion ? { duration: 0 } : WORD_TRANSITION;

  return (
    <span className="word-rotate">
      <button
        className="word-rotate__viewport"
        type="button"
        onClick={advance}
        aria-label={`${word}. Click to show the next profession.`}
      >
        <span className="word-rotate__sizer" aria-hidden="true">
          {safeWords.map((candidate, candidateIndex) => (
            <span
              className={getWordClassName(
                candidate,
                "word-rotate__sizer-word",
              )}
              key={`${candidate}-${candidateIndex}`}
            >
              {candidate}
            </span>
          ))}
        </span>
        <AnimatePresence initial={false} mode="sync">
          <motion.span
            className={getWordClassName(word, "word-rotate__word")}
            key={word}
            initial={initialState}
            animate={{ opacity: 1, y: 0 }}
            exit={exitState}
            transition={transition}
            aria-hidden="true"
          >
            {word}
          </motion.span>
        </AnimatePresence>
      </button>
    </span>
  );
}
