import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import { GitHubContributions } from "./components/GitHubContributions";
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

function mountGitHubContributions(scope = document) {
  const calendar = scope.querySelector(
    "#github-calendar-root:not([data-react-mounted])",
  );

  if (!calendar) return;

  calendar.dataset.reactMounted = "true";
  createRoot(calendar).render(<GitHubContributions />);
}

document.addEventListener("markdown:loaded", (event) => {
  mountPublicationLinks(event.target);
  mountGitHubContributions(event.target);
});

mountPublicationLinks();
mountGitHubContributions();

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
