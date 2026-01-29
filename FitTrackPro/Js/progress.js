// Js/progress.js
const user = requireLogin();

function setDefaultDate() {
  const dateInput = document.getElementById("logDate");
  const today = new Date().toISOString().slice(0, 10);
  dateInput.value = today;
}

function addProgress() {
  if (!user) return;

  const date = document.getElementById("logDate").value;
  const weight = Number(document.getElementById("logWeight").value);
  const msg = document.getElementById("progressMsg");

  if (!date || !weight) {
    msg.textContent = "❌ Please enter date and weight!";
    return;
  }

  const logs = getProgressLogs(user.username);
  const filtered = logs.filter((x) => x.date !== date);
  filtered.unshift({ date, weight });

  saveProgressLogs(user.username, filtered.slice(0, 30));
  msg.textContent = "✅ Progress saved successfully!";
  renderLogs();
  renderChart();
}

function renderLogs() {
  if (!user) return;

  const list = document.getElementById("progressList");
  const logs = getProgressLogs(user.username);
  list.innerHTML = "";

  if (logs.length === 0) {
    list.innerHTML = `<p class="muted">No progress logs yet ✅</p>`;
    return;
  }

  logs.forEach((log) => {
    const row = document.createElement("div");
    row.className = "progress-row";
    row.innerHTML = `
      <div>
        <b>${log.date}</b><br>
        <span class="muted">${log.weight} kg</span>
      </div>
      <button class="btn danger" onclick="deleteLog('${log.date}')">Delete</button>
    `;
    list.appendChild(row);
  });
}

function deleteLog(date) {
  if (!user) return;

  const logs = getProgressLogs(user.username).filter((x) => x.date !== date);
  saveProgressLogs(user.username, logs);
  renderLogs();
  renderChart();
}

function clearProgress() {
  if (!user) return;
  if (!confirm("Clear all progress logs?")) return;

  localStorage.removeItem(getUserKey(user.username, "logs"));
  renderLogs();
  renderChart();
}

function exportCSV() {
  if (!user) return;

  const logs = getProgressLogs(user.username);
  if (logs.length === 0) {
    alert("No logs to export ❌");
    return;
  }

  let csv = "Date,Weight\n";
  logs.slice().reverse().forEach((log) => {
    csv += `${log.date},${log.weight}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "FitTrack_Progress.csv";
  a.click();

  URL.revokeObjectURL(url);
}

// ✅ Simple chart using canvas
function renderChart() {
  const logs = getProgressLogs(user.username).slice().reverse(); // oldest->newest
  const canvas = document.getElementById("progressChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (logs.length < 2) {
    ctx.font = "14px Arial";
    ctx.fillText("Add at least 2 logs to show chart ✅", 10, 30);
    return;
  }

  const padding = 30;
  const w = canvas.width;
  const h = canvas.height;

  const weights = logs.map((l) => l.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);

  // axes
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, h - padding);
  ctx.lineTo(w - padding, h - padding);
  ctx.stroke();

  // plot
  ctx.beginPath();
  logs.forEach((log, i) => {
    const x = padding + (i * (w - padding * 2)) / (logs.length - 1);
    const y =
      h -
      padding -
      ((log.weight - min) * (h - padding * 2)) / (max - min || 1);

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

window.onload = function () {
  if (!user) return;

  const profile = getUserData(user.username);
  if (profile) {
    document.getElementById("progressTitle").innerHTML = `Progress of <b>${profile.name}</b> 📈`;
  }

  setDefaultDate();
  renderLogs();
  renderChart();
};
