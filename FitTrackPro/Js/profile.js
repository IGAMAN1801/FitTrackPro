// Js/profile.js
const user = requireLogin();

window.onload = function () {
  if (!user) return;

  const profile = getUserData(user.username);
  if (profile) {
    document.getElementById("pName").value = profile.name || "";
    document.getElementById("pGoal").value = profile.goal || "Fat Loss";
    document.getElementById("pHeight").value = profile.height || "";
    document.getElementById("pWeight").value = profile.weight || "";
    document.getElementById("pAge").value = profile.age || "";
    document.getElementById("pActivity").value = profile.activity || "1.55";
  }

  const t = getTrackers(user.username);
  document.getElementById("tSteps").value = t.steps || 0;
  document.getElementById("tWater").value = t.water || 0;
  document.getElementById("tProtein").value = t.protein || 0;
};

function saveProfile() {
  const msg = document.getElementById("profileMsg");

  const name = document.getElementById("pName").value.trim();
  const goal = document.getElementById("pGoal").value;
  const height = Number(document.getElementById("pHeight").value);
  const weight = Number(document.getElementById("pWeight").value);
  const age = Number(document.getElementById("pAge").value);
  const activity = document.getElementById("pActivity").value;

  if (!name || !height || !weight || !age) {
    msg.textContent = "❌ Please fill all details properly.";
    return;
  }

  saveUserData(user.username, { name, goal, height, weight, age, activity });
  msg.textContent = "✅ Profile saved successfully!";
}

function saveTrackersUI() {
  const msg = document.getElementById("trackerMsg");

  const steps = Number(document.getElementById("tSteps").value);
  const water = Number(document.getElementById("tWater").value);
  const protein = Number(document.getElementById("tProtein").value);

  saveTrackers(user.username, { steps, water, protein });
  msg.textContent = "✅ Trackers updated!";
}

function updatePassword() {
  const oldPass = document.getElementById("oldPass").value.trim();
  const newPass = document.getElementById("newPass").value.trim();
  const msg = document.getElementById("passMsg");

  const res = changePassword(user.username, oldPass, newPass);
  msg.textContent = res.ok ? `✅ ${res.msg}` : `❌ ${res.msg}`;

  if (res.ok) {
    document.getElementById("oldPass").value = "";
    document.getElementById("newPass").value = "";
  }
}
