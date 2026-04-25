document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel = document.querySelector("[data-nav-panel]");
  const mobileQuery = window.matchMedia("(max-width: 960px)");
  const revealNodes = document.querySelectorAll("[data-reveal]");
  let hideTimer = 0;

  function showPanel() {
    if (!navPanel || !navToggle) {
      return;
    }

    clearTimeout(hideTimer);
    navPanel.hidden = false;

    requestAnimationFrame(() => {
      navPanel.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
    });
  }

  function hidePanel() {
    if (!navPanel || !navToggle) {
      return;
    }

    navPanel.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");

    hideTimer = window.setTimeout(() => {
      if (!navPanel.classList.contains("is-open")) {
        navPanel.hidden = true;
      }
    }, 220);
  }

  function syncMobileState() {
    if (!navPanel || !navToggle) {
      return;
    }

    if (!mobileQuery.matches) {
      clearTimeout(hideTimer);
      navPanel.hidden = true;
      navPanel.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  }

  if (navToggle && navPanel) {
    navPanel.hidden = true;

    navToggle.addEventListener("click", () => {
      if (navPanel.classList.contains("is-open")) {
        hidePanel();
      } else {
        showPanel();
      }
    });

    navPanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileQuery.matches) {
          hidePanel();
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navPanel.classList.contains("is-open")) {
        hidePanel();
      }
    });

    document.addEventListener("click", (event) => {
      if (!mobileQuery.matches || navPanel.hidden) {
        return;
      }

      const clickedInsidePanel = navPanel.contains(event.target);
      const clickedToggle = navToggle.contains(event.target);

      if (!clickedInsidePanel && !clickedToggle) {
        hidePanel();
      }
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
    }, { threshold: 0.18, rootMargin: "0px 0px -10% 0px" });

    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }

  mobileQuery.addEventListener("change", syncMobileState);

  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });

  syncMobileState();
});
