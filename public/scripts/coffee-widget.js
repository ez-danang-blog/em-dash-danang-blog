(() => {
  const widget = document.getElementById("coffee-widget");
  const bubble = document.getElementById("coffee-widget-bubble");
  const closeBtn = document.getElementById("coffee-widget-close");
  if (!widget || !bubble) return;

  // Check if dismissed in this session
  if (sessionStorage.getItem("bmc-prompt-dismissed")) {
    bubble.classList.add("hidden");
  } else {
    let triggered = false;

    const showPrompt = () => {
      if (triggered || sessionStorage.getItem("bmc-prompt-dismissed")) return;
      triggered = true;
      bubble.classList.remove("hidden");
      bubble.classList.add("visible");
    };

    // 1. If inside an article, watch for when user scrolls past 60% of the article
    const article = document.querySelector("article");
    if (article) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            // When reaching the end / bottom portion of the article
            if (entry.isIntersecting) {
              showPrompt();
            }
          }
        },
        { threshold: 0.1 },
      );

      // Create an invisible sentinel at 70% of article or near footer
      const sentinel = document.createElement("div");
      sentinel.style.height = "1px";
      sentinel.style.width = "100%";
      sentinel.style.pointerEvents = "none";
      sentinel.setAttribute("aria-hidden", "true");

      // Place sentinel towards the end of article content
      article.appendChild(sentinel);
      observer.observe(sentinel);
    } else {
      // On non-article pages, trigger after 70% scroll depth
      window.addEventListener(
        "scroll",
        () => {
          const scrollPercent =
            (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
          if (scrollPercent > 0.65) {
            showPrompt();
          }
        },
        { passive: true },
      );
    }
  }

  // Handle dismiss
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      bubble.classList.remove("visible");
      bubble.classList.add("hidden");
      sessionStorage.setItem("bmc-prompt-dismissed", "1");
    });
  }
})();
