const SELAR_LINK = "https://selar.com/14712unl7j";

const themeToggle = document.querySelector(".theme-toggle");
const root = document.documentElement;

function getStoredTheme() {
  try {
    return localStorage.getItem("babsify-theme");
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("babsify-theme", theme);
  } catch (error) {
    // Theme changes still work for this page when storage is unavailable.
  }
}

const storedTheme = getStoredTheme();
if (storedTheme === "light" || storedTheme === "dark") {
  root.dataset.theme = storedTheme;
}

function updateThemeButton() {
  const isDark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
}

themeToggle.addEventListener("click", () => {
  const currentIsDark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  const nextTheme = currentIsDark ? "light" : "dark";
  root.dataset.theme = nextTheme;
  saveTheme(nextTheme);
  updateThemeButton();
});

updateThemeButton();

const offerLink = document.querySelector(".offer-button");
offerLink.href = SELAR_LINK;

const mobileCta = document.querySelector(".mobile-cta");
const hero = document.querySelector(".hero");

if ("IntersectionObserver" in window) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    const showCta = !entry.isIntersecting;
    mobileCta.classList.toggle("is-visible", showCta);
    mobileCta.setAttribute("aria-hidden", String(!showCta));
    mobileCta.querySelector("a").tabIndex = showCta ? 0 : -1;
  }, { threshold: 0 });
  heroObserver.observe(hero);
} else {
  const updateMobileCta = () => {
    const showCta = window.scrollY > hero.offsetHeight;
    mobileCta.classList.toggle("is-visible", showCta);
    mobileCta.setAttribute("aria-hidden", String(!showCta));
    mobileCta.querySelector("a").tabIndex = showCta ? 0 : -1;
  };
  window.addEventListener("scroll", updateMobileCta, { passive: true });
  updateMobileCta();
}

const resultsList = document.querySelector(".results-list");
const featuredResult = resultsList.querySelector('[data-result="your-business"]');
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  resultsList.prepend(featuredResult);
} else {
  window.setTimeout(() => {
    const startingPositions = new Map(
      [...resultsList.children].map((item) => [item, item.getBoundingClientRect()])
    );
    resultsList.prepend(featuredResult);
    const start = startingPositions.get(featuredResult);
    const end = featuredResult.getBoundingClientRect();
    const offsetY = start.top - end.top;
    featuredResult.classList.add("result-moving");
    const animation = featuredResult.animate(
      [
        { transform: `translateY(${offsetY}px)` },
        { transform: "translateY(0)" }
      ],
      { duration: 720, easing: "cubic-bezier(0.2, 0.75, 0.25, 1)" }
    );
    [...resultsList.children].forEach((item) => {
      if (item === featuredResult) return;
      const before = startingPositions.get(item);
      const after = item.getBoundingClientRect();
      const deltaY = before.top - after.top;
      item.animate(
        [
          { transform: `translateY(${deltaY}px)` },
          { transform: "translateY(0)" }
        ],
        { duration: 720, easing: "cubic-bezier(0.2, 0.75, 0.25, 1)" }
      );
    });
    animation.onfinish = () => featuredResult.classList.remove("result-moving");
  }, 300);
}
