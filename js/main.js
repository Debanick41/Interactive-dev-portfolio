import "./projects.js";
import "./contact.js";
/* ========================================
   1. SELECT DOM ELEMENTS
======================================== */

const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
const navigationLinks = document.querySelectorAll(
  ".nav-links a"
);

const sections = document.querySelectorAll(
  "main section[id]"
);

const currentYear = document.querySelector("#current-year");

/* ========================================
   2. MOBILE NAVIGATION
======================================== */

function closeMobileMenu() {
  if (!menuToggle || !navLinks) return;

  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute(
    "aria-label",
    "Open navigation menu"
  );
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isExpanded =
      menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute(
      "aria-expanded",
      String(!isExpanded)
    );

    menuToggle.setAttribute(
      "aria-label",
      isExpanded
        ? "Open navigation menu"
        : "Close navigation menu"
    );

    navLinks.classList.toggle("open", !isExpanded);
  });

  // Close the menu after selecting a section.
  navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Close the menu when the Escape key is pressed.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  // Close the mobile menu if the page becomes desktop-sized.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) {
      closeMobileMenu();
    }
  });
}

/* ========================================
   3. ACTIVE NAVIGATION LINK
======================================== */

function setActiveNavigation(sectionId) {
  navigationLinks.forEach((link) => {
    const isActive =
      link.getAttribute("href") === `#${sectionId}`;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            b.intersectionRatio - a.intersectionRatio
        );

      if (visibleSections.length > 0) {
        setActiveNavigation(visibleSections[0].target.id);
      }
    },
    {
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.25, 0.5, 1],
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

/* ========================================
   4. SCROLL REVEAL ANIMATIONS
======================================== */

const revealElements = document.querySelectorAll(
  ".section-label, .section-title, " +
  ".about-card, .skill-card, " +
  ".project-filters, .timeline-card, .contact-card"
);

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (
  !reduceMotion &&
  "IntersectionObserver" in window
) {
  document.documentElement.classList.add("js-reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
}

/* ========================================
   5. AUTOMATIC COPYRIGHT YEAR
======================================== */

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

/* ========================================
   6. INITIAL NAVIGATION STATE
======================================== */

setActiveNavigation(
  window.location.hash.slice(1) || "home"
);
