import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import { DotsBounce } from "./components/DotsBounce";
import { GitHubContributions } from "./components/GitHubContributions";
import { HeroImageWall } from "./components/HeroImageWall";
import { PublicationLinkSwap } from "./components/PublicationLinkSwap";
import { WordRotate } from "./components/WordRotate";

const mountNode = document.getElementById("word-rotate-root");
const heroImageWallMountNode = document.getElementById("hero-image-wall-root");
const dotsBounceRoots = new Map();

function getDotsBounceNodes(scope) {
  const nodes = [];

  if (scope.matches?.("[data-dots-bounce-root]")) nodes.push(scope);
  scope
    .querySelectorAll?.("[data-dots-bounce-root]:not([data-react-mounted])")
    .forEach((node) => nodes.push(node));

  return nodes;
}

function mountDotsBounce(scope = document) {
  getDotsBounceNodes(scope).forEach((node) => {
    if (node.dataset.reactMounted === "true") return;

    node.dataset.reactMounted = "true";
    const root = createRoot(node);
    dotsBounceRoots.set(node, root);
    root.render(<DotsBounce />);
  });
}

function unmountDotsBounce(scope) {
  scope.querySelectorAll?.("[data-dots-bounce-root]").forEach((node) => {
    const root = dotsBounceRoots.get(node);

    if (!root) return;
    root.unmount();
    dotsBounceRoots.delete(node);
  });
}

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

document.addEventListener("markdown:loading", (event) => {
  mountDotsBounce(event.target);
});

document.addEventListener("markdown:before-render", (event) => {
  unmountDotsBounce(event.target);
});

mountPublicationLinks();
mountGitHubContributions();
mountDotsBounce();

if (heroImageWallMountNode) {
  createRoot(heroImageWallMountNode).render(<HeroImageWall />);
}

if (mountNode) {
  createRoot(mountNode).render(
    <MotionConfig reducedMotion="user">
      <WordRotate
        words={[
          "BIOINFORMATICIAN",
          "GENOME SCIENTIST",
          "FINAL YEAR UNDERGRAD",
          "COMPUTATIONAL BIOLOGIST",
        ]}
      />
    </MotionConfig>,
  );
}
