// Js/planner.js
const user = requireLogin();

function getPlans(goal) {
  const workout = {
    "Fat Loss": [
      ["Monday", "Chest + Triceps + 15 min cardio"],
      ["Tuesday", "Back + Biceps"],
      ["Wednesday", "Legs + Core"],
      ["Thursday", "Shoulders + 20 min cardio"],
      ["Friday", "Full Body + 10 min cardio"],
      ["Saturday", "Light cardio + Stretching"],
      ["Sunday", "Rest / Walk"],
    ],
    "Muscle Gain": [
      ["Monday", "Chest + Triceps"],
      ["Tuesday", "Back + Biceps"],
      ["Wednesday", "Legs Heavy + Core"],
      ["Thursday", "Shoulders + Abs"],
      ["Friday", "Arms + Chest (light)"],
      ["Saturday", "Full Body Strength"],
      ["Sunday", "Rest"],
    ],
    "Maintenance": [
      ["Monday", "Upper Body"],
      ["Tuesday", "Lower Body"],
      ["Wednesday", "Cardio + Abs"],
      ["Thursday", "Push Workout"],
      ["Friday", "Pull Workout"],
      ["Saturday", "Legs + Stretch"],
      ["Sunday", "Rest"],
    ],
  };

  const diet = {
    "Fat Loss": [
      ["Breakfast", "Oats + Banana + Coffee"],
      ["Lunch", "Rice + Dal + Salad + Veg"],
      ["Snack", "Fruit + Green tea"],
      ["Dinner", "Paneer/Chicken + Veggies"],
      ["Tip", "Drink 3-4L water daily"],
    ],
    "Muscle Gain": [
      ["Breakfast", "Eggs/Paneer + Oats + Milk"],
      ["Lunch", "Rice + Dal + Chicken/Paneer"],
      ["Snack", "Banana + Peanut butter"],
      ["Dinner", "Roti + Veg + Protein source"],
      ["Tip", "Protein in every meal"],
    ],
    "Maintenance": [
      ["Breakfast", "Poha/Upma + Tea"],
      ["Lunch", "Rice + Dal + Veg + Curd"],
      ["Snack", "Nuts + Fruit"],
      ["Dinner", "Roti + Sabzi + Salad"],
      ["Tip", "Stay active daily"],
    ],
  };

  return {
    workout: workout[goal] || workout["Fat Loss"],
    diet: diet[goal] || diet["Fat Loss"],
  };
}

function renderTable(data, headings) {
  let html = `<table><thead><tr>`;
  headings.forEach((h) => (html += `<th>${h}</th>`));
  html += `</tr></thead><tbody>`;

  data.forEach((row) => {
    html += `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`;
  });

  html += `</tbody></table>`;
  return html;
}

function resetPlan() {
  if (!user) return;
  localStorage.removeItem(`ft_${user.username}_profile`);
  alert("✅ Plan Reset! Please set details again.");
  window.location.href = "index.html";
}

window.onload = function () {
  if (!user) return;

  const profile = getUserData(user.username);

  if (!profile) {
    alert("❌ Please fill details on Home page first!");
    window.location.href = "index.html";
    return;
  }

  document.getElementById("welcomeText").innerHTML = `Hello, <b>${profile.name}</b> 👋`;
  document.getElementById("goalText").innerHTML = `Goal: <b>${profile.goal}</b>`;

  const plan = getPlans(profile.goal);

  document.getElementById("workoutPlan").innerHTML = renderTable(plan.workout, ["Day", "Workout"]);
  document.getElementById("dietPlan").innerHTML = renderTable(plan.diet, ["Meal", "Plan"]);

  localStorage.setItem(`ft_${user.username}_plan`, JSON.stringify(plan));
};

// ✅ PDF Download
function downloadPlanPDF() {
  const profile = getUserData(user.username);
  const plan = JSON.parse(localStorage.getItem(`ft_${user.username}_plan`) || "null");

  if (!profile || !plan) {
    alert("❌ No plan found!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("FitTrack Pro - Workout & Diet Plan", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Name: ${profile.name}`, 14, 28);
  doc.text(`Goal: ${profile.goal}`, 14, 36);

  doc.setFont("helvetica", "bold");
  doc.text("Workout Plan:", 14, 50);

  let y = 58;
  doc.setFont("helvetica", "normal");
  plan.workout.forEach((w) => {
    doc.text(`• ${w[0]}: ${w[1]}`, 14, y);
    y += 8;
  });

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Diet Plan:", 14, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  plan.diet.forEach((d) => {
    doc.text(`• ${d[0]}: ${d[1]}`, 14, y);
    y += 8;
  });

  doc.save(`FitTrackPlan_${profile.name}.pdf`);
}
