// Js/index.js

const user = requireLogin();

window.onload = function () {
  if (!user) return;

  document.getElementById("userWelcome").textContent = `Logged in as: ${user.username}`;

  const saved = getUserData(user.username);
  if (saved) {
    document.getElementById("name").value = saved.name || "";
    document.getElementById("goal").value = saved.goal || "Fat Loss";
    document.getElementById("height").value = saved.height || "";
    document.getElementById("weight").value = saved.weight || "";
    document.getElementById("age").value = saved.age || "";
    document.getElementById("activity").value = saved.activity || "1.55";
  }
  const t = getTrackers(user.username);
document.getElementById("trackerSummary").innerHTML =
  `🚶 Steps: <b>${t.steps}</b> | 💧 Water: <b>${t.water}</b> glasses | 🥩 Protein: <b>${t.protein}</b> g`;

};

function calculateAll() {
  const name = document.getElementById("name").value.trim();
  const goal = document.getElementById("goal").value;
  const height = Number(document.getElementById("height").value);
  const weight = Number(document.getElementById("weight").value);
  const age = Number(document.getElementById("age").value);
  const activity = Number(document.getElementById("activity").value);
  const resultBox = document.getElementById("bmiResult");
  const t = getTrackers(user.username);
document.getElementById("trackerSummary").innerHTML =
  `🚶 Steps: <b>${t.steps}</b> | 💧 Water: <b>${t.water}</b> glasses | 🥩 Protein: <b>${t.protein}</b> g`;


  if (!name || !height || !weight || !age) {
    resultBox.innerHTML = "❌ Please fill all details!";
    return;
  }

  // ✅ BMI
  const hMeter = height / 100;
  const bmi = (weight / (hMeter * hMeter)).toFixed(1);

  let bmiStatus = "";
  if (bmi < 18.5) bmiStatus = "Underweight";
  else if (bmi < 25) bmiStatus = "Normal";
  else if (bmi < 30) bmiStatus = "Overweight";
  else bmiStatus = "Obese";

  // ✅ Calories (Simple formula - Mifflin St Jeor Male)
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  const maintenance = Math.round(bmr * activity);

  let targetCalories = maintenance;

  if (goal === "Fat Loss") targetCalories = maintenance - 400;
  if (goal === "Muscle Gain") targetCalories = maintenance + 300;
  if (goal === "Maintenance") targetCalories = maintenance;

  resultBox.innerHTML = `
    ✅ Hello <b>${name}</b><br>
    BMI: <b>${bmi}</b> (${bmiStatus})<br><br>
    🔥 Maintenance Calories: <b>${maintenance}</b> kcal/day<br>
    🎯 Target Calories (${goal}): <b>${targetCalories}</b> kcal/day
  `;

  saveUserData(user.username, { name, goal, height, weight, age, activity });
}
