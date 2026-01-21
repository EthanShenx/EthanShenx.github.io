/**
 * Enhanced Theme Toggle with Moon/Sun Icons
 * Switches between Day (light) and Night (dark) modes
 * Persists user preference in localStorage
 */

(function() {
  const body = document.body;
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  // Initialize theme on page load
  function initTheme() {
    // Check localStorage first, then body classes, then system preference
    const savedTheme = localStorage.getItem("colorscheme");

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (body.classList.contains("colorscheme-light") || body.classList.contains("colorscheme-dark")) {
      const initialTheme = body.classList.contains("colorscheme-dark") ? "dark" : "light";
      setTheme(initialTheme);
    } else {
      setTheme(darkModeMediaQuery.matches ? "dark" : "light");
    }
  }

  // Set theme and update UI
  function setTheme(theme) {
    // Remove auto and opposite theme classes
    body.classList.remove("colorscheme-auto");
    const oppositeTheme = theme === "dark" ? "light" : "dark";
    body.classList.remove("colorscheme-" + oppositeTheme);

    // Add the new theme class
    body.classList.add("colorscheme-" + theme);

    // Update color-scheme meta
    document.documentElement.style["color-scheme"] = theme;

    // Update the toggle icon
    updateToggleIcon(theme);

    // Handle embedded content (utterances, giscus)
    updateEmbeddedContent(theme);

    // Dispatch custom event for other scripts
    const event = new Event("themeChanged");
    document.dispatchEvent(event);
  }

  // Update toggle button icon based on current theme
  function updateToggleIcon(currentTheme) {
    if (!darkModeToggle) return;

    const icon = darkModeToggle.querySelector("i");
    if (!icon) return;

    // Remove all icon classes
    icon.className = "";

    // Set icon based on CURRENT theme (shows what clicking will activate)
    // In dark mode, show sun (clicking will go to light)
    // In light mode, show moon (clicking will go to dark)
    if (currentTheme === "dark") {
      icon.className = "fa-solid fa-sun fa-fw";
      darkModeToggle.setAttribute("aria-label", "Switch to light mode");
      darkModeToggle.setAttribute("title", "Switch to light mode");
    } else {
      icon.className = "fa-solid fa-moon fa-fw";
      darkModeToggle.setAttribute("aria-label", "Switch to dark mode");
      darkModeToggle.setAttribute("title", "Switch to dark mode");
    }
  }

  // Save theme preference to localStorage
  function rememberTheme(theme) {
    localStorage.setItem("colorscheme", theme);
  }

  // Update embedded content themes (utterances, giscus)
  function updateEmbeddedContent(theme) {
    // Helper to wait for element
    function waitForElement(selector) {
      return new Promise(resolve => {
        if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
          if (document.querySelector(selector)) {
            resolve(document.querySelector(selector));
            observer.disconnect();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      });
    }

    // Update utterances
    if (theme === "dark") {
      const msg = { type: "set-theme", theme: "github-dark" };
      waitForElement(".utterances-frame").then(frame => {
        frame.contentWindow.postMessage(msg, "https://utteranc.es");
      });
    } else {
      const msg = { type: "set-theme", theme: "github-light" };
      waitForElement(".utterances-frame").then(frame => {
        frame.contentWindow.postMessage(msg, "https://utteranc.es");
      });
    }

    // Update giscus
    function updateGiscus(config) {
      const frame = document.querySelector("iframe.giscus-frame");
      if (!frame) return;
      frame.contentWindow.postMessage({ giscus: config }, "https://giscus.app");
    }
    updateGiscus({ setConfig: { theme: theme } });
  }

  // Toggle theme on button click
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      const currentTheme = body.classList.contains("colorscheme-dark") ? "dark" : "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      setTheme(newTheme);
      rememberTheme(newTheme);
    });
  }

  // Listen to system theme changes
  darkModeMediaQuery.addListener(e => {
    // Only auto-switch if user hasn't set a preference
    if (!localStorage.getItem("colorscheme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });

  // Remove preload transitions class after initialization
  document.addEventListener("DOMContentLoaded", function() {
    const preloadEl = document.querySelector(".preload-transitions");
    if (preloadEl) {
      preloadEl.classList.remove("preload-transitions");
    }
  });

  // Initialize theme immediately
  initTheme();
})();
