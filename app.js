// Variables del documento

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Añadir tarea
/*
    La razón de esta estructura es debido a que adapte un framwork de CSS que me gusta
    a este proyecto, entonces quisé utilizar el checkbox que tiene y usa la
    la estructura en el index. Por esta misma razón es que se generan los elementos de
    una forma extraña en el JS. Además por seguridad se esta escapenado todo input y se evita
    crear las etiquetas con texto plano, excepto en la imagen debido a que no representa una amenaza.
*/
function addTaskElement(task) {
    const newTask = document.createElement('li');

    // Crear el label
    const label = document.createElement('label');
    label.classList.add('aesthetic-windows-95-checkbox');

    // Crear el checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;

    // Crear el span de texto (escapando el texto del usuario)
    const taskText = document.createElement('span');
    taskText.textContent = task.text;

    // Crear el span de estilo
    const checkmark = document.createElement('span');
    checkmark.classList.add('aesthetic-windows-95-checkmark');

    // Añadir los elementos al label
    label.appendChild(taskText);
    label.appendChild(checkbox);
    label.appendChild(checkmark);

    // Añadir el label a la tarea (li)
    newTask.appendChild(label);

    // Crear botón de eliminar
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('aesthetic-windows-95-button-title-bar', 'delete-btn');
    deleteButton.innerHTML = '<img src="msg_error-0.png" alt="eliminar">';
    deleteButton.addEventListener('click', deleteTask);

    // Añadir el botón de eliminar
    newTask.appendChild(deleteButton);

    return newTask;
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Porfavor escriba una tarea primero.");
        return;
    }
  
    const task = { text: taskText, completed: false };
    
    // Añadir <hr> si no es el último elemento
    if (taskList.children.length > 0) {
        const hr = document.createElement('hr');
        taskList.appendChild(hr);
    }

    const taskElement = addTaskElement(task);
    taskList.appendChild(taskElement);

    // Guardar y limpiar el input de texto
    saveTasks();
    taskInput.value = "";
}

// Función para marcar como completado. Le agrega o quita la clase "completed" al <li>.
// Debido a que el checkbox se encuentra dentro del mismo, este siempre sera el más cercano.
function toggleTask(event) {
    const taskItem = event.target.closest('li');
    taskItem.classList.toggle('completed', event.target.checked);
    saveTasks();
}

// Añadir evento al botón para agregar la tarea
addTaskBtn.addEventListener('click', addTask);

// Función para borrar elemento
function deleteTask(event) {

    const taskItem = event.target.closest('li');
    const hr = taskItem.previousElementSibling;
    
   // Elimina el <li> y el <hr> que tenga previo al <li>.
    taskItem.remove();
    if (hr && hr.tagName === 'HR') {
        hr.remove();
    }
    saveTasks();
}

// Añadir la tarea al presionar 'Enter'
taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Función para guardar las tareas en local storage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(task => {
        const text = task.querySelector('label').textContent.trim();
        const completed = task.querySelector('input[type="checkbox"]').checked;
        tasks.push({ text, completed });
    });
    console.log("Guardando tareas: ", tasks); // Depuración
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function escapeHTML(text) {
    const element = document.createElement('div');
    element.innerText = text;
    return element.innerHTML;
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskElement = addTaskElement({ 
            text: escapeHTML(task.text),  // Escapar el texto de la tarea
            completed: task.completed 
        });

        if (task.completed) {
            taskElement.classList.add('completed');
        }
        taskList.appendChild(taskElement);

        // Añadir <hr> si no es el último elemento
        if (task !== tasks[tasks.length - 1]) {
            const hr = document.createElement('hr');
            taskList.appendChild(hr);
        }

        const checkbox = taskElement.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', toggleTask);
    });
}

// Cargar tareas al cargar la página
window.addEventListener('DOMContentLoaded', loadTasks);