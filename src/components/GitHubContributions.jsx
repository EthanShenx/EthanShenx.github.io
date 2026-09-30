import { useEffect, useState } from "react";
import { ActivityCalendar } from "react-activity-calendar";

const USERNAME = "EthanShenx";
// Daily snapshot written by .github/workflows/github-contributions.yml
const DATA_URL = "/data/github-contributions.json";

const THEME = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

function getColorScheme() {
  return document.body.classList.contains("colorscheme-dark") ? "dark" : "light";
}

export function GitHubContributions() {
  const [colorScheme, setColorScheme] = useState(getColorScheme);
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const syncColorScheme = () => setColorScheme(getColorScheme());

    document.addEventListener("themeChanged", syncColorScheme);
    return () => document.removeEventListener("themeChanged", syncColorScheme);
  }, []);

  useEffect(() => {
    fetch(DATA_URL, { cache: "no-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((json) => setData(json.contributions))
      .catch(() => setFailed(true));
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
        {failed ? (
          <div>GitHub contribution data is temporarily unavailable.</div>
        ) : (
          <ActivityCalendar
            data={data ?? []}
            loading={!data}
            theme={THEME}
            colorScheme={colorScheme}
            maxLevel={4}
            blockSize={11}
            blockMargin={4}
            blockRadius={2}
            fontSize={13}
            showColorLegend
            showMonthLabels
            showTotalCount
            labels={{ totalCount: "{{count}} contributions in the last year" }}
          />
        )}
      </div>
    </section>
  );
}
