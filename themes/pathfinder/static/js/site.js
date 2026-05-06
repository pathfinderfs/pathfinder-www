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
        label: "30/70",
        shortLabel: "30/70",
        categoryLabel: "Conservative",
        floor: 35916,
        floorWr: "3.59%",
        expected: 50507,
        expectedWr: "5.05%",
        ceiling: 69109,
        ceilingWr: "6.91%",
        insight: "This allocation has the highest downside floor in the range, with less upside than the stock-heavier portfolios."
      },
      {
        label: "40/60",
        shortLabel: "40/60",
        floor: 35230,
        floorWr: "3.52%",
        expected: 51515,
        expectedWr: "5.15%",
        ceiling: 72911,
        ceilingWr: "7.29%",
        insight: "The downside floor remains close to 30/70, while expected and upside spending move modestly higher."
      },
      {
        label: "50/50",
        shortLabel: "50/50",
        categoryLabel: "Moderate",
        floor: 34098,
        floorWr: "3.41%",
        expected: 52341,
        expectedWr: "5.23%",
        ceiling: 77185,
        ceilingWr: "7.72%",
        insight: "This middle allocation balances a still-strong floor with more expected spending than the lower-stock mixes."
      },
      {
        label: "60/40",
        shortLabel: "60/40",
        floor: 32627,
        floorWr: "3.26%",
        expected: 52976,
        expectedWr: "5.30%",
        ceiling: 81756,
        ceilingWr: "8.18%",
        insight: "Expected spending rises slightly from 50/50, while the downside floor starts to move lower."
      },
      {
        label: "70/30",
        shortLabel: "70/30",
        categoryLabel: "Aggressive",
        floor: 30908,
        floorWr: "3.09%",
        expected: 53445,
        expectedWr: "5.34%",
        ceiling: 86398,
        ceilingWr: "8.64%",
        insight: "This allocation has the highest upside in the range, but also the lowest downside floor."
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
        button.setAttribute("aria-label", `Select ${portfolio.label} portfolio`);

        const screenReaderText = document.createElement("span");
        screenReaderText.className = "visually-hidden";
        screenReaderText.textContent = `${portfolio.label} portfolio: upside ${formatDollars(portfolio.ceiling)} per year at a ${portfolio.ceilingWr} withdrawal rate, expected ${formatDollars(portfolio.expected)} per year at a ${portfolio.expectedWr} withdrawal rate, downside floor ${formatDollars(portfolio.floor)} per year at a ${portfolio.floorWr} withdrawal rate.`;

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

        label.append(fullLabel, shortLabel);

        if (portfolio.categoryLabel) {
          const categoryLabel = document.createElement("small");
          categoryLabel.textContent = portfolio.categoryLabel;
          label.append(categoryLabel);
        }

        labelsNode.append(label);
        return label;
      });

      function updateScenario() {
        const portfolio = portfolios[selectedIndex];
        const floorTone = selectedIndex >= 4 ? "danger" : selectedIndex >= 3 ? "warning" : "muted";
        const insightTone = selectedIndex >= 4 ? "danger" : selectedIndex >= 3 ? "warning" : "success";

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
