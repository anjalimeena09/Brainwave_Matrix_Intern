document.addEventListener("DOMContentLoaded", function () {
    const prevDayButton = document.getElementById("prev-day");
    const nextDayButton = document.getElementById("next-day");
    const scheduleContainer = document.getElementById("schedule-container");
    const modeToggleButton = document.querySelector(".mode-toggle");
    let currentDate = new Date();

    function showToast(message) {
        const toast = document.createElement("div");
        toast.classList.add("toast");
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    function updateDate() {
        document.getElementById("current-date").textContent = currentDate.toDateString();
        generateTimeSlots();
        loadSavedTasks();
    }

    

    prevDayButton.addEventListener("click", function () {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDate();
    });

    nextDayButton.addEventListener("click", function () {
        currentDate.setDate(currentDate.getDate() + 1);
        updateDate();
    });

    function generateTimeSlots() {
        scheduleContainer.innerHTML = "";
        for (let i = 0; i < 24; i++) {
            const timeSlot = document.createElement("div");
            timeSlot.classList.add("time-slot");
            timeSlot.dataset.hour = i;
            timeSlot.innerHTML = `
                <div class="time-header">
                    <strong>${i.toString().padStart(2, "0")}:00 Hr</strong>
                </div>
                <div class="task-container">
                    <input type="text" class="task-input" placeholder="Enter task">
                    <button class="create-btn">Create</button>
                    </div>
                <div class="tasks"></div>
            `;

            scheduleContainer.appendChild(timeSlot);

            const createButton = timeSlot.querySelector(".create-btn");
            createButton.addEventListener("click", function () {
                addTask(i, timeSlot);
            });
        }
    }

    function addTask(hour, timeSlot) {
        const taskInput = timeSlot.querySelector(".task-input");
        const tasksDiv = timeSlot.querySelector(".tasks");

        if (taskInput.value.trim() !== "") {
            const taskData = {
                text: taskInput.value,
                completed: false,
            };

            saveTask(hour, taskData);
            renderTasks(hour, tasksDiv);
            taskInput.value = "";
            showToast("Task added successfully!");
        }
    }

    function removeTask(hour) {
        const savedTasks = JSON.parse(localStorage.getItem(`tasks-${currentDate.toDateString()}`)) || {};
        delete savedTasks[hour];
        localStorage.setItem(`tasks-${currentDate.toDateString()}`, JSON.stringify(savedTasks));
        showToast("Task deleted successfully!");
    }

    function saveTask(hour, taskData) {
        const savedTasks = JSON.parse(localStorage.getItem(`tasks-${currentDate.toDateString()}`)) || {};
        savedTasks[hour] = taskData;
        localStorage.setItem(`tasks-${currentDate.toDateString()}`, JSON.stringify(savedTasks));
    }

    function renderTasks(hour, tasksDiv) {
        tasksDiv.innerHTML = "";
        const savedTasks = JSON.parse(localStorage.getItem(`tasks-${currentDate.toDateString()}`)) || {};
        const taskData = savedTasks[hour];

        if (taskData) {
            const taskItem = document.createElement("div");
            taskItem.classList.add("task-item");
            taskItem.innerHTML = `
                <input type="checkbox" class="task-check" ${taskData.completed ? "checked" : ""}>
                <input type="text" class="task-text" value="${taskData.text}" disabled>
                <button class="edit-btn" ${taskData.completed ? "disabled" : ""}>Edit</button>
                <button class="delete-btn">Delete</button>
            `;

            const checkBox = taskItem.querySelector(".task-check");
            const taskText = taskItem.querySelector(".task-text");
            const deleteButton = taskItem.querySelector(".delete-btn");
            const editButton = taskItem.querySelector(".edit-btn");

            checkBox.addEventListener("change", function () {
                taskData.completed = checkBox.checked;
                saveTask(hour, taskData);
            
                taskText.style.textDecoration = checkBox.checked ? "line-through" : "none";
                taskItem.style.backgroundColor = checkBox.checked ? "#c8e6c9" : "#e0d7f5";
            
                taskText.disabled = checkBox.checked;
                editButton.disabled = checkBox.checked;
            
                if (checkBox.checked) {
                    showToast("Task completed successfully!");
                }
            });
            

            deleteButton.addEventListener("click", function () {
                removeTask(hour);
                renderTasks(hour, tasksDiv);
            });

            editButton.addEventListener("click", function () {
                if (editButton.textContent === "Edit") {
                    taskText.disabled = false;
                    taskText.focus();
                    editButton.textContent = "Save";
                } else {
                    taskData.text = taskText.value;
                    saveTask(hour, taskData);
                    taskText.disabled = true;
                    editButton.textContent = "Edit";
                    showToast("Task edited successfully!");
                }
            });

            if (taskData.completed) {
                taskText.style.textDecoration = "line-through";
                taskItem.style.backgroundColor = "#c8e6c9";
                taskText.disabled = true;
                editButton.disabled = true;
            }

            tasksDiv.appendChild(taskItem);
        }
    }
    function showToast(message) {
        const toastContainer = document.querySelector(".toast-container") || document.createElement("div");
        toastContainer.classList.add("toast-container");
        document.body.appendChild(toastContainer);
    
        const toast = document.createElement("div");
        toast.classList.add("toast");
    
        toast.innerHTML = `
            <span class="toast-icon">✔</span>
            <span>${message}</span>
            <span class="toast-close">&times;</span>
            <div class="progress"></div>
        `;
    
        toastContainer.appendChild(toast);
    
        const closeButton = toast.querySelector(".toast-close");
        closeButton.addEventListener("click", () => {
            toast.remove();
        });
    
        setTimeout(() => {
            toast.remove();
        }, 1000);
    }
    
    
    function loadSavedTasks() {
        document.querySelectorAll(".time-slot").forEach(timeSlot => {
            const hour = timeSlot.dataset.hour;
            const tasksDiv = timeSlot.querySelector(".tasks");
            renderTasks(hour, tasksDiv);
        });
    }

    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
        modeToggleButton.textContent = document.body.classList.contains("dark-mode") ? "Disable Dark Mode" : "Enable Dark Mode";
    }

    function loadDarkModePreference() {
        if (localStorage.getItem("darkMode") === "true") {
            document.body.classList.add("dark-mode");
            modeToggleButton.textContent = "Disable Dark Mode";
        } else {
            modeToggleButton.textContent = "Enable Dark Mode";
        }
    }

    modeToggleButton.addEventListener("click", toggleDarkMode);

    loadDarkModePreference();
    updateDate();
});