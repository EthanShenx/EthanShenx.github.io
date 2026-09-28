import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import { MatrixRain } from "./components/MatrixRain";
import { PublicationLinkSwap } from "./components/PublicationLinkSwap";
import { WordRotate } from "./components/WordRotate";

const mountNode = document.getElementById("word-rotate-root");
const matrixRainMountNode = document.getElementById("matrix-rain-root");

function mountPublicationLinks(scope = document) {
  scope.querySelectorAll(".publication-link:not([data-react-mounted])").forEach((link) => {
    const image = link.querySelector("img");

    if (!image) return;

    const imageSrc = image.getAttribute("src");
    link.dataset.reactMounted = "true";
    createRoot(link).render(
      <PublicationLinkSwap imageSrc={imageSrc} />,
    );
  });
}

document.addEventListener("markdown:loaded", (event) => {
  mountPublicationLinks(event.target);
});

mountPublicationLinks();

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
