try {
  const stored = localStorage.getItem("sumi-theme");
  if (stored === "light" || stored === "dark") {
    document.documentElement.dataset.theme = stored;
  }
} catch {}
