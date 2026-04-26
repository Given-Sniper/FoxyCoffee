const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("message");

if (loginForm && loginMessage) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginMessage.textContent = "Checking your details...";
    loginMessage.className = "form-message";

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        loginMessage.textContent = "Login successful";
        loginMessage.className = "form-message success";
        loginForm.reset();
      } else {
        loginMessage.textContent = "Invalid email or password";
        loginMessage.className = "form-message error";
      }
    } catch (error) {
      loginMessage.textContent = "Error connecting to server";
      loginMessage.className = "form-message error";
    }
  });
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  const registerMessage = registerForm.closest(".form-panel").querySelector(".form-message");

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = registerForm.querySelector('input[name="fullName"]').value.trim();
    const email = registerForm.querySelector('input[name="email"]').value.trim();
    const password = registerForm.querySelector('input[name="password"]').value;
    const confirmPassword = registerForm.querySelector('input[name="confirmPassword"]').value;

    if (password !== confirmPassword) {
      registerMessage.textContent = "Passwords do not match.";
      registerMessage.className = "form-message error";
      return;
    }

    registerMessage.textContent = "Creating your account...";
    registerMessage.className = "form-message";

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fullName, email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        registerMessage.textContent = "Account created successfully. You can now log in.";
        registerMessage.className = "form-message success";
        registerForm.reset();
      } else {
        registerMessage.textContent = data.message || "Unable to create account.";
        registerMessage.className = "form-message error";
      }
    } catch (error) {
      registerMessage.textContent = "Error connecting to server";
      registerMessage.className = "form-message error";
    }
  });
}
