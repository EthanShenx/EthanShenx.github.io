import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import { WordRotate } from "./components/WordRotate";

const mountNode = document.getElementById("word-rotate-root");

if (mountNode) {
  createRoot(mountNode).render(
    <MotionConfig reducedMotion="user">
      <WordRotate words={["Bioinfomatician", "Genome Scientist"]} />
    </MotionConfig>,
  );
}
