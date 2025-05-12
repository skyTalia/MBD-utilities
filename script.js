const taskListEl = document.getElementById("taskList");
const taskInputEl = document.getElementById("taskInput");

document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  const taskText = taskInputEl.value.trim();
  if (taskText === "") return;

  const tasks = getStoredTasks();
  if (tasks.includes(taskText)) {
    alert("Task already exists.");
    return;
  }

  tasks.push(taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  renderTask(taskText);
  taskInputEl.value = "";
}

function loadTasks() {
  const tasks = getStoredTasks();
  tasks.forEach(renderTask);
}

function getStoredTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(taskText) {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  const label = document.createElement("label");
  label.textContent = " " + taskText;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑";
  deleteBtn.title = "Delete Task";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = () => deleteTask(taskText, li);

  const leftContainer = document.createElement("span");
  leftContainer.appendChild(checkbox);
  leftContainer.appendChild(label);

  li.appendChild(leftContainer);
  li.appendChild(deleteBtn);

  taskListEl.appendChild(li);
}

function deleteTask(taskText, liElement) {
  let tasks = getStoredTasks();
  tasks = tasks.filter(task => task !== taskText);
  saveTasks(tasks);
  taskListEl.removeChild(liElement);
}

function clearAllTasks() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    localStorage.removeItem("tasks");
    taskListEl.innerHTML = "";
  }
}

function generateTemplate() {
  const checkboxes = document.querySelectorAll("#taskList input[type='checkbox']");
  const selectedTasks = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const taskText = checkbox.nextSibling.textContent.trim();
      selectedTasks.push(`- ${taskText}`);
    }
  });

  const template = selectedTasks.length
    ? `Hi sir, today I was able to do the following:\n${selectedTasks.join("\n")}\n\nThat's all from me for today. Thank you. 🙂`
    : "Hi sir, I didn't mark any tasks today.\n\nThat's all from me for today. Thank you. 🙂";

  document.getElementById("output").value = template;
}

function copyTemplate() {
  const output = document.getElementById("output");
  output.select();
  document.execCommand("copy");
  alert("Template copied to clipboard!");
}

function downloadTemplate() {
  const text = document.getElementById("output").value;
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.download = "task_template.txt";
  link.href = URL.createObjectURL(blob);
  link.click();
}

function clearTemplate() {
  document.getElementById("output").value = "";
}
