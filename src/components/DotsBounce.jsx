import { motion, useReducedMotion } from "framer-motion";

const DOTS = [0, 1, 2];

export function DotsBounce() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="dots-bounce flex flex-col items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div
        className="dots-bounce__dots flex items-center justify-center gap-2"
        aria-hidden="true"
      >
        {DOTS.map((index) => (
          <motion.span
            key={index}
            className="dots-bounce__dot h-2 w-2 rounded-full bg-zinc-800"
            animate={prefersReducedMotion ? { y: 0 } : { y: [0, -10, 0] }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: 0.6,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: index * 0.15,
                  }
            }
          />
        ))}
      </div>
      <span className="dots-bounce__label">Loading</span>
    </div>
  );
}
