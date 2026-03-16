document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel = document.querySelector("[data-nav-panel]");
  const submenuToggles = Array.from(document.querySelectorAll("[data-submenu-toggle]"));
  const mobileQuery = window.matchMedia("(max-width: 900px)");

  function closeSubmenus(except = null) {
    submenuToggles.forEach((button) => {
      const item = button.closest(".nav-item");
      const shouldStayOpen = except && item === except;
      item?.classList.toggle("is-open", shouldStayOpen);
      button.setAttribute("aria-expanded", shouldStayOpen ? "true" : "false");
    });
  }

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
      closeSubmenus();
    }
  }

  if (navToggle && navPanel) {
    navPanel.hidden = true;
    navToggle.addEventListener("click", () => {
      const isOpen = navPanel.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navPanel.hidden = !isOpen;
      if (!isOpen) {
        closeSubmenus();
      }
    });
  }

  submenuToggles.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const item = button.closest(".nav-item");
      const willOpen = !item?.classList.contains("is-open");
      closeSubmenus(willOpen ? item : null);
      button.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) {
      closeSubmenus();
    }
  });

  mobileQuery.addEventListener("change", syncMobileState);
  syncMobileState();
});
