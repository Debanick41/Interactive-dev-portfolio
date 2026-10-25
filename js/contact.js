
/* ========================================
   1. SELECT FORM ELEMENTS
======================================== */

const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");

/* ========================================
   2. VALIDATE AND HANDLE FORM SUBMISSION
======================================== */

if (contactForm && formFeedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Let the browser handle required fields,
    // email format, and minlength validation.
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const formData = new FormData(contactForm);

    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const message = formData.get("message").trim();

    // Additional validation for whitespace-only input.
    if (
      name.length < 2 ||
      email.length === 0 ||
      message.length < 10
    ) {
      formFeedback.textContent =
        "Please enter a valid name, email, and message.";

      return;
    }

    // No backend or email service is connected yet.
    // Prepare an email draft in the visitor's email app.
    const recipient = "debanick8@gmail.com";

    if (recipient === "debanick8@gmail.com") {
      formFeedback.textContent =
        "Form validation passed! Configure your email address to enable message sending.";

      return;
    }

    const subject = `Portfolio inquiry from ${name}`;

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const mailtoUrl =
      `mailto:${recipient}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    formFeedback.textContent =
      "Opening your email application...";

    window.location.href = mailtoUrl;
  });
}
