// Js/common.js

/* =========================
   ✅ THEME (Light/Dark)
========================= */
function setTheme(mode) {
  if (mode === "dark") document.body.classList.add("dark");
  else document.body.classList.remove("dark");
  localStorage.setItem("ft_theme", mode);
}

function toggleTheme() {
  const isDark = document.body.classList.contains("dark");
  setTheme(isDark ? "light" : "dark");
}

(function loadTheme() {
  const mode = localStorage.getItem("ft_theme") || "light";
  setTheme(mode);
})();

/* =========================
   ✅ AUTH SYSTEM
========================= */
function getUsers() {
  return JSON.parse(localStorage.getItem("ft_users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("ft_users", JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("ft_currentUser")) || null;
}

function setCurrentUser(user) {
  localStorage.setItem("ft_currentUser", JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem("ft_currentUser");
  window.location.href = "login.html";
}

function requireLogin() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

/* =========================
   ✅ USER DATA HELPERS
========================= */
function getUserKey(username, key) {
  return `ft_${username}_${key}`;
}

function saveUserData(username, data) {
  localStorage.setItem(getUserKey(username, "profile"), JSON.stringify(data));
}

function getUserData(username) {
  return JSON.parse(localStorage.getItem(getUserKey(username, "profile"))) || null;
}

function getProgressLogs(username) {
  return JSON.parse(localStorage.getItem(getUserKey(username, "logs"))) || [];
}

function saveProgressLogs(username, logs) {
  localStorage.setItem(getUserKey(username, "logs"), JSON.stringify(logs));
}

/* =========================
   ✅ TRACKERS (Steps/Water/Protein)
========================= */
function getTrackers(username) {
  return (
    JSON.parse(localStorage.getItem(getUserKey(username, "trackers"))) || {
      steps: 0,
      water: 0, // glasses
      protein: 0, // grams
    }
  );
}

function saveTrackers(username, trackers) {
  localStorage.setItem(getUserKey(username, "trackers"), JSON.stringify(trackers));
}

/* =========================
   ✅ PASSWORD CHANGE
========================= */
function changePassword(username, oldPass, newPass) {
  const users = getUsers();
  const user = users.find((u) => u.username === username);

  if (!user) return { ok: false, msg: "User not found" };
  if (user.password !== oldPass) return { ok: false, msg: "Old password incorrect" };
  if (!newPass || newPass.length < 4) return { ok: false, msg: "New password must be 4+ characters" };

  user.password = newPass;
  saveUsers(users);
  return { ok: true, msg: "Password changed successfully ✅" };
}
