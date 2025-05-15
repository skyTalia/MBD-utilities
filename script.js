document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const generateTemplateBtn = document.getElementById("generateTemplateBtn");
  const clearTemplateBtn = document.getElementById("clearTemplateBtn");
  const templateOutput = document.getElementById("templateOutput");

  const hoursInput = document.getElementById("hoursInput");
  const logTimeBtn = document.getElementById("logTimeBtn");
  const logTableBody = document.querySelector("#logTable tbody");
  const totalHoursEl = document.getElementById("totalHours");
  const totalUSDEl = document.getElementById("totalUSD");
  const grossPHPEl = document.getElementById("grossPHP");
  const deductionEl = document.getElementById("deduction");
  const netPHPEl = document.getElementById("netPHP");

  const hourlyRate = 4.5;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let logs = JSON.parse(localStorage.getItem("logs")) || [];

  let exchangeRate = 56;

  async function fetchExchangeRate() {
    console.log("Fetching exchange rate...");
    const apiKey = 'qJbPumAsGrD9TBgPB06cgWLnXxptwHcQr3s7odpdh9Uzo6CoKWRsX6iWFmfd3gKE';
    const url = `https://api.unirateapi.com/api/convert?api_key=${apiKey}&amount=1&from=USD&to=PHP`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        const rate = data.result;
        document.getElementById('exchangeRate').textContent = `Current USD to PHP exchange rate: ₱${rate.toFixed(2)} (Automatically refreshes every 5 minutes.)`;
        // Update your app’s exchangeRate value too
        exchangeRate = rate;
      })
      .catch(error => {
        console.error("Failed to fetch exchange rate:", error);
        document.getElementById('exchangeRate').textContent = "Failed to fetch exchange rate.";
      });
}


  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.classList.toggle("checked", task.checked);

      // Create task container
      const container = document.createElement("div");
      container.className = "task-container";

      // Checkbox button (left side)
      const checkBtn = document.createElement("button");
      checkBtn.className = "check-task";
      checkBtn.textContent = task.checked ? "✅" : "⬜";
      container.appendChild(checkBtn);

      // Task text span
      const taskText = document.createElement("span");
      taskText.className = "task-text";
      taskText.textContent = task.text;
      taskText.contentEditable = false;
      container.appendChild(taskText);

      // Buttons container
      const buttonsDiv = document.createElement("div");
      buttonsDiv.className = "task-buttons";

      // Edit button
      const editBtn = document.createElement("button");
      editBtn.className = "edit-task";
      editBtn.textContent = "✏️";
      buttonsDiv.appendChild(editBtn);

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-task";
      deleteBtn.textContent = "🗑️";
      buttonsDiv.appendChild(deleteBtn);

      container.appendChild(buttonsDiv);
      li.appendChild(container);
      taskList.appendChild(li);

      // Events
      checkBtn.addEventListener("click", () => {
        tasks[index].checked = !tasks[index].checked;
        saveTasks();
        renderTasks();
      });

      deleteBtn.addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      editBtn.addEventListener("click", () => {
        const isEditing = taskText.isContentEditable;
        if (isEditing) {
          taskText.contentEditable = false;
          editBtn.textContent = "✏️";
          tasks[index].text = taskText.textContent.trim();
          saveTasks();
          renderTasks();
        } else {
          taskText.contentEditable = true;
          taskText.focus();
          editBtn.textContent = "💾";
        }
      });
    });
  }

  function generateTemplate() {
    const completedTasks = tasks
      .filter((t) => t.checked)
      .map((t) => `- ${t.text}`)
      .join("\n");
    templateOutput.value = `Hi sir, today I was able to do the following:\n\n${completedTasks}\n\nThat's all from me for today. Thank you. 🙂`;
  }

  function clearTemplate() {
    templateOutput.value = "";
  }

  function logTime() {
    const hours = parseFloat(hoursInput.value);
    if (isNaN(hours) || hours <= 0) return;

    const date = new Date().toLocaleDateString();
    const earningsUSD = hours * hourlyRate;
    const earningsPHP = earningsUSD * exchangeRate;

    const log = { date, hours, earningsUSD, earningsPHP };
    logs.push(log);
    localStorage.setItem("logs", JSON.stringify(logs));

    updateLogTable();
    updateSummary();
    hoursInput.value = "";
  }

  function updateLogTable() {
    logTableBody.innerHTML = "";
    logs.forEach((log) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${log.date}</td>
        <td>${log.hours}</td>
        <td>$${log.earningsUSD.toFixed(2)}</td>
        <td>₱${log.earningsPHP.toLocaleString()}</td>
      `;
      logTableBody.appendChild(row);
    });
  }

  function updateSummary() {
    const totalHours = logs.reduce((sum, log) => sum + log.hours, 0);
    const totalUSD = logs.reduce((sum, log) => sum + log.earningsUSD, 0);
    const totalPHP = logs.reduce((sum, log) => sum + log.earningsPHP, 0);
    const deduction = totalPHP * 0.15;
    const net = totalPHP - deduction;

    totalHoursEl.textContent = totalHours.toFixed(2);
    totalUSDEl.textContent = `$${totalUSD.toFixed(2)}`;
    grossPHPEl.textContent = `₱${totalPHP.toLocaleString()}`;
    deductionEl.textContent = `₱${deduction.toLocaleString()}`;
    netPHPEl.textContent = `₱${net.toLocaleString()}`;
  }

  addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({ text, checked: false });
      saveTasks();
      renderTasks();
      taskInput.value = "";
    }
  });

  generateTemplateBtn.addEventListener("click", generateTemplate);
  clearTemplateBtn.addEventListener("click", clearTemplate);
  logTimeBtn.addEventListener("click", logTime);

  document.getElementById('clearTimeTrackerBtn').addEventListener('click', () => {
  localStorage.removeItem('logs');
  logs = [];
  updateLogTable();
  updateSummary();
  hoursInput.value = '';
});


  renderTasks();
  updateLogTable();
  updateSummary();
  fetchExchangeRate();
  setInterval(fetchExchangeRate, 5 * 60 * 1000);
  

});
