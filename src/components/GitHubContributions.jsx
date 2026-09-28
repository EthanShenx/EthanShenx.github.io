import { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";

const USERNAME = "EthanShenx";

function getColorScheme() {
  return document.body.classList.contains("colorscheme-dark") ? "dark" : "light";
}

export function GitHubContributions() {
  const [colorScheme, setColorScheme] = useState(getColorScheme);

  useEffect(() => {
    const syncColorScheme = () => setColorScheme(getColorScheme());

    document.addEventListener("themeChanged", syncColorScheme);
    return () => document.removeEventListener("themeChanged", syncColorScheme);
  }, []);

  return (
    <section className="github-contributions" aria-labelledby="github-contributions-title">
      <header className="github-contributions__header">
        <h3 id="github-contributions-title">GitHub Contributions</h3>
        <a
          className="github-contributions__profile"
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          @{USERNAME} <span aria-hidden="true">↗</span>
        </a>
      </header>
      <div className="github-contributions__calendar" tabIndex="0">
        <GitHubCalendar
          username={USERNAME}
          colorScheme={colorScheme}
          blockSize={11}
          blockMargin={4}
          blockRadius={2}
          fontSize={13}
          showColorLegend
          showMonthLabels
          showTotalCount
          labels={{ totalCount: "{{count}} contributions in the last year" }}
          errorMessage="GitHub contribution data is temporarily unavailable."
        />
      </div>
    </section>
  );
}
