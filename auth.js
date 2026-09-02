document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // LOGIN
  // =========================

  const loginForm =
    document.getElementById("loginForm");

  if (loginForm) {

    loginForm.addEventListener("submit", (event) => {

      event.preventDefault();

      const email =
        document
          .getElementById("email")
          .value
          .trim()
          .toLowerCase();

      const password =
        document.getElementById("password").value;

      const message =
        document.getElementById("loginMessage");

      const users = getUsers();

      const user = users.find(
        (item) =>
          item.email === email &&
          item.password === password
      );

      if (!user) {

        message.className = "error";

        message.textContent =
          "Invalid email or password.";

        return;
      }

      setCurrentUser(user);

      message.className = "success";

      message.textContent =
        "Login successful.";

      setTimeout(() => {

        window.location.href =
          "dashboard.html";

      }, 500);

    });

  }


  // =========================
  // REGISTER
  // =========================

  const registerForm =
    document.getElementById("registerForm");

  if (registerForm) {

    registerForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();

        const name =
          document
            .getElementById("name")
            .value
            .trim();

        const email =
          document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();

        const password =
          document
            .getElementById("password")
            .value;

        const roles =
          Array.from(
            document.querySelectorAll(
              'input[name="role"]:checked'
            )
          ).map(
            (input) => input.value
          );

        const message =
          document.getElementById(
            "registerMessage"
          );


        // Check role

        if (roles.length === 0) {

          message.className = "error";

          message.textContent =
            "Please select at least one account type.";

          return;
        }


        // Check password

        if (password.length < 6) {

          message.className = "error";

          message.textContent =
            "Password must be at least 6 characters.";

          return;
        }


        // Get users

        const users = getUsers();


        // Check existing email

        const existingUser =
          users.find(
            (user) =>
              user.email === email
          );

        if (existingUser) {

          message.className = "error";

          message.textContent =
            "This email is already registered.";

          return;
        }


        // Create user

        const newUser = {

          id: uid("user"),

          name: name,

          email: email,

          password: password,

          roles: roles,

          balance: 0,

          createdAt:
            new Date().toISOString()

        };


        // Save user

        users.push(newUser);

        saveUsers(users);


        // Login automatically

        setCurrentUser(newUser);


        message.className = "success";

        message.textContent =
          "Account created successfully.";


        setTimeout(() => {

          window.location.href =
            "dashboard.html";

        }, 500);

      }
    );

  }

});