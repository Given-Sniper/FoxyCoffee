const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".auth-form").forEach((form) => {
  const message = form.closest(".form-panel").querySelector(".form-message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (form.dataset.form === "register") {
      const password = form.querySelector('input[name="password"]').value;
      const confirmPassword = form.querySelector('input[name="confirmPassword"]').value;

      if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        return;
      }
    }

    message.textContent = form.dataset.form === "login"
      ? "Logged in successfully."
      : "Account created successfully.";
    form.reset();
  });
});
