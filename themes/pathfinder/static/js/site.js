document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel = document.querySelector("[data-nav-panel]");
  const mobileQuery = window.matchMedia("(max-width: 900px)");

  function syncMobileState() {
    if (!navToggle || !navPanel) {
      return;
    }

    if (mobileQuery.matches) {
      navPanel.hidden = !navPanel.classList.contains("is-open");
    } else {
      navPanel.hidden = false;
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

  mobileQuery.addEventListener("change", syncMobileState);
  syncMobileState();
});
