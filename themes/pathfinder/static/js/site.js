document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel = document.querySelector("[data-nav-panel]");
  const mobileQuery = window.matchMedia("(max-width: 960px)");
  const revealNodes = document.querySelectorAll("[data-reveal]");

  function syncMobileState() {
    if (!navToggle || !navPanel) {
      return;
    }

    if (mobileQuery.matches) {
      navPanel.hidden = !navPanel.classList.contains("is-open");
    } else {
      navPanel.hidden = true;
      navPanel.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  }

  if (navToggle && navPanel) {
    navPanel.hidden = true;
    navToggle.addEventListener("click", () => {
      const isOpen = navPanel.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navPanel.hidden = !isOpen;
    });
  }

  if (revealNodes.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }

  mobileQuery.addEventListener("change", syncMobileState);
  syncMobileState();
});
