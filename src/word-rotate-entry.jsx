import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import { MatrixRain } from "./components/MatrixRain";
import { WordRotate } from "./components/WordRotate";

const mountNode = document.getElementById("word-rotate-root");
const matrixRainMountNode = document.getElementById("matrix-rain-root");

if (matrixRainMountNode) {
  createRoot(matrixRainMountNode).render(<MatrixRain />);
}

if (mountNode) {
  createRoot(mountNode).render(
    <MotionConfig reducedMotion="user">
      <WordRotate
        words={[
          "Bioinformatician",
          "Genome Scientist",
          "A Final-Year Undergrad",
          "Computational Biologist",
        ]}
      />
    </MotionConfig>,
  );
}
