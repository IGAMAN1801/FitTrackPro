// Js/login.js

function registerUser() {
  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("authMsg");

  if (username.length < 3 || password.length < 4) {
    msg.textContent = "❌ Username min 3 chars & Password min 4 chars";
    return;
  }

  const users = getUsers();
  const exists = users.find((u) => u.username === username);

  if (exists) {
    msg.textContent = "❌ Username already exists. Try login.";
    return;
  }

  users.push({ username, password });
  saveUsers(users);

  msg.textContent = "✅ Account created! Now click Login.";
}

function loginUser() {
  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("authMsg");

  const users = getUsers();
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    msg.textContent = "❌ Wrong username or password";
    return;
  }

  setCurrentUser({ username });
  msg.textContent = "✅ Login successful! Redirecting...";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 700);
}

// Auto redirect if already logged in
(function () {
  const current = getCurrentUser();
  if (current) {
    window.location.href = "index.html";
  }
})();
