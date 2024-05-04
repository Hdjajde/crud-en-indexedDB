import initDB from "./initDB.js";
initDB();

const reset = document.getElementById("reset");
const form = document.getElementById("add-task");
const tasksContainer = document.getElementById("tasks");
const taskInput = document.getElementById("task");

function deleteTask(id) {
  const request = indexedDB.open("TODO");

  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction("tareas", "readwrite");
    const store = transaction.objectStore("tareas");

    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = () => {
      renderTasks();
    };
  }
  
}

function detectModifications(htmlElement, id) {
  htmlElement.addEventListener("blur", () => {
    const task = htmlElement.value
    modifyTask(id, task);
  });
  htmlElement.addEventListener("keypress", (e) => {
    if(e.key === "Enter") {
      const task = htmlElement.value
      modifyTask(id, task);
    }
  });
}

function modifyTask(id, task) {
  const request = indexedDB.open("TODO");

  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction("tareas", "readwrite");
    const store = transaction.objectStore("tareas");

    store.put({task, id});
  }
}

function renderTasks() {
  const request = indexedDB.open("TODO");

  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction("tareas", "readonly");
    const store = transaction.objectStore("tareas");

    tasksContainer.innerHTML = `
    <tr 
      class="text-center font-semibold mb-2"
    >
      <th
        class="text-center"
      >Tarea</th>
      <th>Eliminar</th>
    </tr>
    `;

    const allTasks = store.getAll();

    allTasks.onsuccess = () => {
      allTasks.result.forEach( task => {

        const tr = document.createElement("tr");
        
        const input = document.createElement("input");
        input.value = task.task;
        detectModifications(input, task.id);
        input.classList = "text-center w-full p-2 rounded";
        input.autocomplete = "off";
        const tdTask = document.createElement("td");
        tdTask.appendChild(input);
        tr.appendChild(tdTask);

        const td = document.createElement("td");
        td.classList = "text-center";

        const button = document.createElement("button");
        button.classList = "delete-task bg-red-500 rounded p-2 hover:bg-red-600 hover:shadow-lg transition";
        button.innerHTML = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>';
        button.addEventListener("click", () => {
          deleteTask(task.id);
        });
        td.appendChild(button);
        tr.appendChild(td);
        tasksContainer.appendChild(tr);
      });

    }
  };
}

renderTasks();

form.addEventListener("submit", (e) => {
  const task = {
    task: taskInput.value
  }

  const request = indexedDB.open("TODO");

  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction("tareas", "readwrite");
    const store = transaction.objectStore("tareas");

    const addRequest = store.add(task);

    addRequest.onsuccess = () => {
      taskInput.value = "";
      renderTasks();
    }

  };

  e.preventDefault();
})

reset.addEventListener("click", () => {
  indexedDB.deleteDatabase("TODO");
  console.log("DB borrada");
  window.location.reload();
});