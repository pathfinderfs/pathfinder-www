document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel = document.querySelector("[data-nav-panel]");
  const mobileQuery = window.matchMedia("(max-width: 960px)");
  const revealNodes = document.querySelectorAll("[data-reveal]");
  const portfolioScenarioNodes = document.querySelectorAll("[data-portfolio-scenarios]");
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

  function initPortfolioScenarios() {
    const portfolios = [
      {
        label: "Conservative",
        shortLabel: "Cons.",
        alloc: "30/70",
        floor: 36000,
        expected: 44000,
        ceiling: 55000,
        insight: "The floor stays well above a minimal spending level. The main risk here is under-spending: leaving money behind that was never used."
      },
      {
        label: "Mod.-Cons.",
        shortLabel: "M-C",
        alloc: "50/50",
        floor: 28000,
        expected: 49000,
        ceiling: 65000,
        insight: "A solid floor for most clients. The downside scenario is real, but manageable if your spending plan has flexibility built in."
      },
      {
        label: "Moderate",
        shortLabel: "Mod.",
        alloc: "60/40",
        floor: 22000,
        expected: 53000,
        ceiling: 75000,
        insight: "The floor drops meaningfully. At $22,000 per year, a bad sequence of returns would require significant adjustments for most retirees."
      },
      {
        label: "Growth",
        shortLabel: "Grow",
        alloc: "75/25",
        floor: 14000,
        expected: 58000,
        ceiling: 88000,
        insight: "A floor of $14,000 would be unacceptable for almost any retirement plan. This portfolio offers real upside, and a real risk of an outcome you couldn't absorb."
      },
      {
        label: "Aggressive",
        shortLabel: "Agg.",
        alloc: "90/10",
        floor: 7000,
        expected: 63000,
        ceiling: 102000,
        insight: "A $7,000 annual floor from a $1M portfolio. A bad sequence of returns early in retirement, at this allocation, could be unrecoverable."
      }
    ];
    const chartHeight = 240;
    const scale = 110000;
    const dollarFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    });

    function toY(value) {
      return Math.round((1 - value / scale) * chartHeight);
    }

    function formatDollars(value) {
      return dollarFormatter.format(value);
    }

    function createMetric(label, value, modifier) {
      const card = document.createElement("div");
      card.className = "portfolio-scenarios__metric-card";

      const labelNode = document.createElement("div");
      labelNode.className = "portfolio-scenarios__metric-label";
      labelNode.textContent = label;

      const valueNode = document.createElement("div");
      valueNode.className = `portfolio-scenarios__metric-value portfolio-scenarios__metric-value--${modifier}`;
      valueNode.textContent = `${formatDollars(value)}/yr`;

      card.append(labelNode, valueNode);
      return card;
    }

    portfolioScenarioNodes.forEach((node) => {
      const barsNode = node.querySelector("[data-scenario-bars]");
      const labelsNode = node.querySelector("[data-scenario-labels]");
      const detailNode = node.querySelector("[data-scenario-detail]");
      let selectedIndex = 2;

      if (!barsNode || !labelsNode || !detailNode) {
        return;
      }

      const barButtons = portfolios.map((portfolio, index) => {
        const ceilingY = toY(portfolio.ceiling);
        const expectedY = toY(portfolio.expected);
        const floorY = toY(portfolio.floor);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "portfolio-scenarios__bar-option";
        button.setAttribute("aria-label", `Select ${portfolio.label} ${portfolio.alloc} portfolio`);

        const screenReaderText = document.createElement("span");
        screenReaderText.className = "visually-hidden";
        screenReaderText.textContent = `${portfolio.label} ${portfolio.alloc}: good sequence ${formatDollars(portfolio.ceiling)} per year, expected ${formatDollars(portfolio.expected)} per year, bad sequence floor ${formatDollars(portfolio.floor)} per year.`;

        const track = document.createElement("span");
        track.className = "portfolio-scenarios__bar-track";
        track.setAttribute("aria-hidden", "true");

        const upside = document.createElement("span");
        upside.className = "portfolio-scenarios__zone portfolio-scenarios__zone--upside";
        upside.style.top = `${ceilingY}px`;
        upside.style.height = `${expectedY - ceilingY}px`;

        const downside = document.createElement("span");
        downside.className = "portfolio-scenarios__zone portfolio-scenarios__zone--downside";
        downside.style.top = `${expectedY}px`;
        downside.style.height = `${floorY - expectedY}px`;

        const expectedLine = document.createElement("span");
        expectedLine.className = "portfolio-scenarios__expected-line";
        expectedLine.style.top = `${expectedY}px`;

        track.append(upside, downside, expectedLine);
        button.append(screenReaderText, track);
        button.addEventListener("click", () => {
          selectedIndex = index;
          updateScenario();
        });
        barsNode.append(button);
        return button;
      });

      const labelNodes = portfolios.map((portfolio) => {
        const label = document.createElement("div");
        label.className = "portfolio-scenarios__label";

        const fullLabel = document.createElement("span");
        fullLabel.className = "portfolio-scenarios__label-full";
        fullLabel.textContent = portfolio.label;

        const shortLabel = document.createElement("span");
        shortLabel.className = "portfolio-scenarios__label-short";
        shortLabel.textContent = portfolio.shortLabel;

        const allocation = document.createElement("small");
        allocation.textContent = portfolio.alloc;

        label.append(fullLabel, shortLabel, allocation);
        labelsNode.append(label);
        return label;
      });

      function updateScenario() {
        const portfolio = portfolios[selectedIndex];
        const floorTone = selectedIndex >= 3 ? "danger" : selectedIndex >= 2 ? "warning" : "muted";
        const insightTone = selectedIndex >= 3 ? "danger" : selectedIndex >= 2 ? "warning" : "success";

        barButtons.forEach((button, index) => {
          const isActive = index === selectedIndex;
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-pressed", String(isActive));
        });

        labelNodes.forEach((label, index) => {
          label.classList.toggle("is-active", index === selectedIndex);
        });

        const metrics = document.createElement("div");
        metrics.className = "portfolio-scenarios__metrics";
        metrics.append(
          createMetric("Good sequence", portfolio.ceiling, "success"),
          createMetric("Expected", portfolio.expected, "muted"),
          createMetric("Bad sequence floor", portfolio.floor, floorTone)
        );

        const insight = document.createElement("div");
        insight.className = `portfolio-scenarios__insight portfolio-scenarios__insight--${insightTone}`;
        insight.textContent = portfolio.insight;

        detailNode.replaceChildren(metrics, insight);
      }

      updateScenario();
      node.classList.add("is-ready");
    });
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

  initPortfolioScenarios();

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
