
/* ========================================
   1. PROJECT DATA
======================================== */
const projects = [
  {
    title: "Interactive Developer Portfolio",
    category: "frontend",
    description:
      "A responsive developer portfolio featuring glassmorphism, animated sections, project filters, and an accessible project-details modal.",
    icon: "</>",
    technologies: ["HTML", "CSS", "JavaScript"],
    demo: "",
    source: "",
  },
  {
    title: "Multi-Vendor Marketplace",
    category: "frontend",
    description:
      "A marketplace project focused on product discovery, vendor storefronts, and a scalable shopping experience.",
    icon: "◇",
    technologies: ["React", "Node.js", "Express", "MongoDB"],
    demo: "",
    source: "",
  },
  {
    title: "HelixDesk AI",
    category: "frontend",
    description:
      "An AI customer-support platform concept with a React interface and a Python FastAPI backend.",
    icon: "✦",
    technologies: ["React", "Python", "FastAPI", "PostgreSQL"],
    demo: "",
    source: "",
  },
];  
/* ========================================
   2. SELECT DOM ELEMENTS
======================================== */

const projectsGrid = document.querySelector("#projects-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectsEmpty = document.querySelector("#projects-empty");

/* ========================================
   3. SAFE HTML HELPERS
======================================== */

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

/* ========================================
   4. CREATE PROJECT CARDS
======================================== */

function createProjectCard(project) {
  const article = createElement(
    "article",
    "glass-card project-card"
  );

  const image = createElement(
    "div",
    "project-image",
    project.icon
  );

  image.setAttribute("aria-hidden", "true");

  const content = createElement("div", "project-content");

  const title = createElement("h3", "", project.title);

  const description = createElement(
    "p",
    "",
    project.description
  );

  const tags = createElement("div", "project-tags");

  project.technologies.forEach((technology) => {
    tags.appendChild(
      createElement("span", "", technology)
    );
  });

  const actions = createElement("div", "project-actions");

  const detailsButton = createElement(
    "button",
    "project-link",
    "View Details"
  );

  detailsButton.type = "button";
  detailsButton.addEventListener("click", () => {
    openProjectModal(project);
  });

  actions.append(detailsButton);

  if (isValidExternalUrl(project.demo)) {
    const demoLink = createElement(
      "a",
      "project-link",
      "Live Demo ↗"
    );

    demoLink.href = project.demo;
    demoLink.target = "_blank";
    demoLink.rel = "noopener noreferrer";

    actions.appendChild(demoLink);
  }

  if (isValidExternalUrl(project.source)) {
    const sourceLink = createElement(
      "a",
      "project-link",
      "Source Code ↗"
    );

    sourceLink.href = project.source;
    sourceLink.target = "_blank";
    sourceLink.rel = "noopener noreferrer";

    actions.appendChild(sourceLink);
  }

  content.append(title, description, tags, actions);
  article.append(image, content);

  return article;
}

function isValidExternalUrl(value) {
  if (!value) return false;

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" ||
      url.protocol === "http:"
    );
  } catch {
    return false;
  }
}

/* ========================================
   5. RENDER PROJECTS
======================================== */

function renderProjects(category = "all") {
  if (!projectsGrid) return;

  const filteredProjects =
    category === "all"
      ? projects
      : projects.filter(
          (project) => project.category === category
        );

  projectsGrid.replaceChildren();

  filteredProjects.forEach((project) => {
    projectsGrid.appendChild(createProjectCard(project));
  });

  if (projectsEmpty) {
    projectsEmpty.hidden = filteredProjects.length > 0;
  }
}

/* ========================================
   6. PROJECT FILTERS
======================================== */

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;

      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    });

    renderProjects(category);
  });
});

/* ========================================
   7. PROJECT DETAILS MODAL
======================================== */

let activeModal = null;
let previouslyFocusedElement = null;

function closeProjectModal() {
  if (!activeModal) return;

  activeModal.remove();
  activeModal = null;

  if (previouslyFocusedElement?.isConnected) {
    previouslyFocusedElement.focus();
  }

  previouslyFocusedElement = null;
}

function openProjectModal(project) {
  closeProjectModal();

  previouslyFocusedElement = document.activeElement;

  const overlay = createElement("div", "modal-overlay");
  overlay.id = "project-modal-overlay";

  const dialog = createElement("section", "glass-card project-modal");
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "modal-title");
  dialog.setAttribute("aria-describedby", "modal-description");
  dialog.tabIndex = -1;

  const closeButton = createElement(
    "button",
    "modal-close",
    "×"
  );

  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close project details");

  const title = createElement(
    "h2",
    "",
    project.title
  );

  title.id = "modal-title";

  const description = createElement(
    "p",
    "",
    project.details
  );

  description.id = "modal-description";

  const technologyList = createElement("div", "project-tags");

  project.technologies.forEach((technology) => {
    technologyList.appendChild(
      createElement("span", "", technology)
    );
  });

  closeButton.addEventListener("click", closeProjectModal);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeProjectModal();
    }
  });

  dialog.append(closeButton, title, description, technologyList);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  activeModal = overlay;
  closeButton.focus();
}

document.addEventListener("keydown", (event) => {
  if (!activeModal) return;

  if (event.key === "Escape") {
    closeProjectModal();
    return;
  }

  if (event.key === "Tab") {
    const focusableElements = activeModal.querySelectorAll(
      'button, a[href], input, textarea, select, [tabindex="0"]'
    );

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === last
    ) {
      event.preventDefault();
      first.focus();
    }
  }
});

/* ========================================
   8. INITIAL RENDER
======================================== */

renderProjects();
