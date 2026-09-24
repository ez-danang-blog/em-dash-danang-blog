(() => {
  const root = document.documentElement;
  const button = document.querySelector("[data-theme-toggle]");
  if (!button) return;

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const resolve = () => root.dataset.theme || (media.matches ? "dark" : "light");

  const syncLabel = () => {
    const next = resolve() === "dark" ? "light" : "dark";
    button.setAttribute("aria-label", `Switch to ${next} theme`);
  };

  const syncThemeColor = () => {
    if (!root.dataset.theme) return;

    let pinned = document.querySelector('meta[name="theme-color"]:not([media])');
    if (!pinned) {
      for (const meta of document.querySelectorAll('meta[name="theme-color"][media]')) {
        meta.remove();
      }
      pinned = document.createElement("meta");
      pinned.setAttribute("name", "theme-color");
      document.head.appendChild(pinned);
    }
    const bg = getComputedStyle(document.body).backgroundColor;
    if (bg) pinned.setAttribute("content", bg);
  };

  button.addEventListener("click", () => {
    const next = resolve() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("sumi-theme", next);
    } catch {}
    syncLabel();
    syncThemeColor();
  });

  media.addEventListener("change", () => {
    if (!root.dataset.theme) syncLabel();
  });

  syncLabel();
})();
