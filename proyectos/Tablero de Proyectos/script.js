const STORAGE_KEY = "pulseboard-state-v1";
const columns = [
  { id: "backlog", label: "Backlog", tone: "Ideas y pendientes" },
  { id: "todo", label: "Do", tone: "Lista para iniciar" },
  { id: "progress", label: "In progress", tone: "En ejecución" },
  { id: "review", label: "Review", tone: "Validación" },
  { id: "done", label: "Done", tone: "Cerrado" }
];
const seedTasks = [
  ["Light Sleep sincronizado con RTC externo", "Embebidos", "progress", "Alta"],
  ["Buffer circular en EEPROM I2C para eventos offline", "Embebidos", "todo", "Alta"],
  ["Ajustar tramas JSON para Firebase y Telegram", "Embebidos", "review", "Alta"],
  ["Calibrar ADC con promedio móvil", "Embebidos", "backlog", "Media"],
  ["Control de motor paso a paso con encoder", "Embebidos", "todo", "Alta"],
  ["Configurar sensores CO2 en STM32", "Embebidos", "backlog", "Media"],
  ["Módulos VHDL para displays de 7 segmentos", "Embebidos", "backlog", "Baja"],
  ["Dimensionar snubber RCD del Flyback", "Potencia", "progress", "Alta"],
  ["Diseñar gate driver y reducir pérdidas térmicas", "Potencia", "todo", "Alta"],
  ["Sintonizar PID discreto con anti-windup", "Potencia", "review", "Media"],
  ["Panel de instrumentación en LabVIEW", "Interfaces", "backlog", "Media"],
  ["Optimizar fusión de hojas de cálculo", "Datos / GIS", "done", "Media"],
  ["Visualizador cartográfico interactivo EERSA", "Datos / GIS", "todo", "Media"],
  ["Coordinación de fusibles en Chambo", "Datos / GIS", "backlog", "Alta"],
  ["Plantilla IEEE a doble columna", "Documentación", "done", "Baja"]
].map((item, index) => ({ id: `seed-${index}`, title: item[0], area: item[1], status: item[2], priority: item[3], createdAt: Date.now() - (index * 3600000) }));

let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || { tasks: seedTasks, archive: [], activity: [{ text: "Tablero inicializado con tu mapa técnico", at: Date.now() }] };
let activeFilter = "Todas";
let memoryTab = "activity";
const board = document.getElementById("board");
const taskDialog = document.getElementById("taskDialog");
const memoryDialog = document.getElementById("memoryDialog");

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); updateStats(); }
function addActivity(text) { state.activity.unshift({ text, at: Date.now() }); state.activity = state.activity.slice(0, 30); }
function formatTime(timestamp) { return new Intl.RelativeTimeFormat("es", { numeric: "auto" }).format(Math.round((timestamp - Date.now()) / 86400000), "day"); }
function filteredTasks() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  return state.tasks.filter(task => (activeFilter === "Todas" || task.area === activeFilter) && (!query || `${task.title} ${task.area}`.toLowerCase().includes(query)));
}
function render() {
  const tasks = filteredTasks();
  board.innerHTML = columns.map(column => {
    const columnTasks = tasks.filter(task => task.status === column.id);
    return `<article class="column" data-status="${column.id}"><header class="column-head"><div><strong class="column-title">${column.label}</strong><small style="display:block;color:#8b9b92;font-size:10px;margin-top:4px">${column.tone}</small></div><span class="column-count">${columnTasks.length}</span></header><div class="task-list" data-dropzone="${column.id}">${columnTasks.length ? columnTasks.map(renderTask).join("") : '<div class="empty-column">Suelta aquí una tarea</div>'}</div></article>`;
  }).join("");
  board.querySelectorAll(".task-card").forEach(card => { card.addEventListener("dragstart", event => event.dataTransfer.setData("text/plain", card.dataset.id)); });
  board.querySelectorAll("[data-dropzone]").forEach(zone => { zone.addEventListener("dragover", event => event.preventDefault()); zone.addEventListener("drop", moveByDrop); });
  board.querySelectorAll(".move-button").forEach(button => button.addEventListener("click", () => moveTask(button.dataset.id)));
  board.querySelectorAll(".delete-button").forEach(button => button.addEventListener("click", () => deleteTask(button.dataset.id)));
  updateStats();
}
function renderTask(task) { return `<article class="task-card" draggable="true" data-id="${task.id}" data-priority="${task.priority}"><div class="task-top"><span class="task-area">${task.area}</span><span class="priority">${task.priority}</span></div><h3>${escapeHtml(task.title)}</h3><div class="task-meta"><span>Actualizada ${formatTime(task.createdAt)}</span><span><button class="move-button" data-id="${task.id}" title="Mover a la siguiente columna" aria-label="Mover tarea">→</button><button class="delete-button" data-id="${task.id}" title="Enviar a la papelera" aria-label="Eliminar tarea">×</button></span></div></article>`; }
function escapeHtml(value) { return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char])); }
function moveByDrop(event) { const id = event.dataTransfer.getData("text/plain"); const task = state.tasks.find(item => item.id === id); if (task && task.status !== event.currentTarget.dataset.dropzone) { task.status = event.currentTarget.dataset.dropzone; task.createdAt = Date.now(); addActivity(`Moviste “${task.title}” a ${columns.find(column => column.id === task.status).label}`); save(); render(); toast("Tarea actualizada"); } }
function moveTask(id) { const task = state.tasks.find(item => item.id === id); const current = columns.findIndex(column => column.id === task.status); if (current < columns.length - 1) { task.status = columns[current + 1].id; task.createdAt = Date.now(); addActivity(`Avanzaste “${task.title}” a ${columns[current + 1].label}`); save(); render(); toast("Tarea movida"); } }
function deleteTask(id) { const index = state.tasks.findIndex(task => task.id === id); if (index < 0) return; const task = state.tasks.splice(index, 1)[0]; task.deletedAt = Date.now(); state.archive.unshift(task); addActivity(`Enviaste “${task.title}” a la papelera`); save(); render(); toast("Tarea guardada en la papelera"); }
function updateStats() { const done = state.tasks.filter(task => task.status === "done").length; const total = state.tasks.length || 1; const percent = Math.round(done / total * 100); document.getElementById("progressValue").textContent = percent; document.getElementById("sprintProgress").textContent = `${percent}% completado`; document.getElementById("memoryCount").textContent = state.activity.length + state.archive.length; }
function toast(message) { const element = document.getElementById("toast"); element.textContent = message; element.classList.add("visible"); setTimeout(() => element.classList.remove("visible"), 2200); }
function renderMemory() { const content = document.getElementById("memoryContent"); document.getElementById("archiveCount").textContent = state.archive.length; content.innerHTML = memoryTab === "activity" ? (state.activity.length ? state.activity.map(item => `<div class="memory-item"><div>${escapeHtml(item.text)}<small>${formatTime(item.at)}</small></div></div>`).join("") : "<p class=\"memory-description\">Todavía no hay actividad.</p>") : (state.archive.length ? state.archive.map(task => `<div class="memory-item"><div>${escapeHtml(task.title)}<small>${task.area} · eliminada ${formatTime(task.deletedAt)}</small></div><button class="restore-button" data-restore="${task.id}" type="button">Restaurar</button></div>`).join("") : "<p class=\"memory-description\">La papelera está vacía.</p>"); content.querySelectorAll("[data-restore]").forEach(button => button.addEventListener("click", () => restoreTask(button.dataset.restore))); }
function restoreTask(id) { const index = state.archive.findIndex(task => task.id === id); if (index < 0) return; const task = state.archive.splice(index, 1)[0]; delete task.deletedAt; state.tasks.push(task); addActivity(`Restauraste “${task.title}”`); save(); render(); renderMemory(); toast("Tarea restaurada"); }

document.getElementById("newTaskButton").addEventListener("click", () => taskDialog.showModal());
document.getElementById("taskForm").addEventListener("submit", event => { event.preventDefault(); const task = { id: `task-${Date.now()}`, title: document.getElementById("taskTitle").value.trim(), area: document.getElementById("taskArea").value, status: document.getElementById("taskStatus").value, priority: document.getElementById("taskPriority").value, createdAt: Date.now() }; state.tasks.unshift(task); addActivity(`Añadiste “${task.title}”`); save(); render(); taskDialog.close(); event.target.reset(); toast("Tarea creada"); });
document.getElementById("searchInput").addEventListener("input", render);
document.getElementById("filterGroup").addEventListener("click", event => { const button = event.target.closest("[data-filter]"); if (!button) return; activeFilter = button.dataset.filter; document.querySelectorAll(".filter-button").forEach(item => item.classList.toggle("active", item === button)); render(); });
document.getElementById("memoryButton").addEventListener("click", () => { memoryDialog.showModal(); renderMemory(); });
document.getElementById("closeMemory").addEventListener("click", () => memoryDialog.close());
document.querySelectorAll(".memory-tab").forEach(tab => tab.addEventListener("click", () => { memoryTab = tab.dataset.memoryTab; document.querySelectorAll(".memory-tab").forEach(item => item.classList.toggle("active", item === tab)); renderMemory(); }));
render();