document.addEventListener("DOMContentLoaded", () => {
    // Henter knappen til at vise/skjule opgavehåndtereren og selve opgavehåndteringssektionen
    const toggleFormButton = document.getElementById("toggle-form-btn");
    const taskHandler = document.getElementById("task-handler");

    // Tilføjer en lytter til knappen, der skifter synligheden af opgavehåndteringssektionen
    toggleFormButton.addEventListener("click", () => {
        taskHandler.classList.toggle("visible"); // Tilføjer/fjerner "visible"-klassen

        // Skifter knapteksten afhængig af om opgavehåndteringen er synlig eller ej
        if (taskHandler.classList.contains("visible")) {
            toggleFormButton.textContent = "Skjul Opgaver";
        } else {
            toggleFormButton.textContent = "Vis Opgaver";
        }
    });

    // Henter inputfelter til opgavenavn, prioritet, deadline samt knappen til at tilføje en opgave
    const taskInput = document.getElementById("task");
    const priorityInput = document.getElementById("priority");
    const deadlineInput = document.getElementById("deadline");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");

    // Funktion der gemmer opgaver i localStorage som en JSON-struktur
    function saveTasksToLocalStorage(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Funktion der henter opgaver fra localStorage. Hvis der ikke er nogen opgaver, returneres en tom liste
    function getTasksFromLocalStorage() {
        const tasks = localStorage.getItem("tasks");
        return tasks ? JSON.parse(tasks) : [];
    }

    // Funktion der genererer HTML for hver opgave, baseret på data fra localStorage
    function renderTasks(tasks) {
        taskList.innerHTML = "";  // Rydder task-list-elementet, før nye opgaver tilføjes
        tasks.forEach(task => {
            const taskItem = document.createElement("div");
            taskItem.classList.add("task");

            // Vælger farve og tekst til flag baseret på opgavens prioritet
            let flagColor;
            let priorityText;
            if (task.priority === "top") {
                flagColor = "red";
                priorityText = "Høj Prioritet";
            } else if (task.priority === "middle") {
                flagColor = "yellow";
                priorityText = "Mellem Prioritet";
            } else if (task.priority === "low") {
                flagColor = "gray";
                priorityText = "Lav Prioritet";
            }

            // Genererer HTML-indhold for opgaven, inklusive navn, prioritet og deadline
            taskItem.innerHTML = `
            <div class="task-info">
                <p>${task.name}</p>
                <p><i class="fa-solid fa-flag" style="color: ${flagColor};"></i> ${priorityText}</p>
                <p><i class="fa-solid fa-calendar"></i> Deadline: ${task.deadline}</p>
            </div>
            <button class="mark-done"><i class="fas fa-check"></i></button>
            <button class="remove-task"><i class="fas fa-trash"></i></button>
            `;

            // Hvis opgaven er markeret som færdig, ændres dens stil
            if (task.completed) {
                taskItem.style.backgroundColor = "#f2f2f2";
                taskItem.querySelector(".mark-done").disabled = true; // Deaktiverer færdig-knappen
            }

            // Tilføjer opgaven til task-list-elementet
            taskList.appendChild(taskItem);

            // Tilføjer en lytter til knappen "Mark Done", der markerer opgaven som færdig
            taskItem.querySelector(".mark-done").addEventListener("click", () => {
                task.completed = true;  // Marker opgaven som færdig
                saveTasksToLocalStorage(tasks); // Gem opdateringen i localStorage
                renderTasks(tasks); // Genrender opgaverne
            });

            // Tilføjer en lytter til knappen "Remove Task", der sletter opgaven
            taskItem.querySelector(".remove-task").addEventListener("click", () => {
                const index = tasks.indexOf(task); // Find opgavens placering i listen
                tasks.splice(index, 1);  // Fjern opgaven fra listen
                saveTasksToLocalStorage(tasks); // Gem opdateret liste i localStorage
                renderTasks(tasks); // Genrender opgaverne
            });
        });
    }

    // Lytter til knappen "Add Task" og tilføjer en ny opgave til listen
    addTaskButton.addEventListener("click", () => {
        const taskName = taskInput.value;  // Henter opgavens navn
        const priority = priorityInput.value;  // Henter opgavens prioritet
        const deadline = deadlineInput.value;  // Henter opgavens deadline

        // Validering: Tjekker om opgavens navn og deadline er udfyldt
        if (taskName.trim() === "" || deadline === "") {
            alert("Indtast venligst en opgave og vælg en fremtidig dato som deadline.");
            return;
        }

        // Validering: Tjekker om deadline er i fremtiden
        const selectedDate = new Date(deadline);
        const currentDate = new Date();
        if (selectedDate <= currentDate) {
            alert("Vælg venligst en fremtidig deadline.");
            return;
        }

        // Formaterer deadline-datoen til britisk format (dd/mm/yyyy)
        const formattedDate = selectedDate.toLocaleDateString('en-GB');

        // Opretter et nyt task-objekt
        const task = {
            name: taskName,
            priority: priority,
            deadline: formattedDate,
            completed: false
        };

        // Henter eksisterende opgaver, tilføjer den nye opgave, og gemmer listen igen
        const tasks = getTasksFromLocalStorage();
        tasks.push(task);
        saveTasksToLocalStorage(tasks);
        renderTasks(tasks);  // Genrender listen med den nye opgave

        // Rydder inputfelterne efter oprettelse af opgave
        taskInput.value = "";
        priorityInput.value = "top";
        deadlineInput.value = "";
    });

    // Når siden indlæses, henter og viser den eksisterende opgaveliste fra localStorage
    const tasks = getTasksFromLocalStorage();
    renderTasks(tasks);
});
