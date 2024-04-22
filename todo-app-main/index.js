
document.addEventListener("DOMContentLoaded", () => {
    const taskItem = document.querySelector(".task-ctr-template");
    const taskCtr = document.querySelector("#tasks");

    const completed = [];
    const active = 0;
    let taskCount = 0;

    document.getElementById("theme-btn").addEventListener("click", (e) => {
        const main = document.getElementById("main");
        const mainClasses = main.classList;
        if (mainClasses.contains("dark")){
            mainClasses.remove("dark");
            e.currentTarget.querySelector("img").setAttribute("src", "images/icon-moon.svg");
            main.style.backgroundImage = "url('images/bg-desktop-light.jpg')";

        } else {
            mainClasses.add("dark");
            e.currentTarget.querySelector("img").setAttribute("src", "images/icon-sun.svg");
            main.style.backgroundImage = "url('images/bg-desktop-dark.jpg')";
        }
    })

    document.getElementById("new-todo-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const inputEl = e.target.elements.task;
        const taskVal = inputEl.value.trim();
        if (taskVal) {
            const taskEl = taskItem.cloneNode(true);
            taskEl.setAttribute("id", ++taskCount);
            taskEl.querySelector("input").value = taskVal;
            taskEl.style.display = "flex";
            addTaskElListeners(taskEl);
            taskCtr.appendChild(taskEl);

            updateTotalActiveTasks();
        }

        inputEl.value = "";
    })

    document.getElementById("filter-btn-ctr").addEventListener("click", (e) => {
        const targetEl = e.target;
        if (targetEl.id !== "filter-btn-ctr") {
            const currSelectedEl = e.currentTarget.querySelector("button.selected");
            if (currSelectedEl.innerHTML != targetEl.innerHTML) {
                currSelectedEl.classList.remove("selected");
                targetEl.classList.add("selected");

                handleFilterTasks(targetEl.innerHTML);
            }
        }
    })

    document.getElementById("clear-compl-tasks-btn").addEventListener("click", (e) => {
        taskCtr.querySelectorAll(".task-ctr-template .check-btn.checked").forEach(el => {
            let taskEl = el.closest(".task-ctr-template");
            removeTaskElListeners(taskEl);
            taskEl.remove();
        })
    })

    taskCtr.addEventListener("dragover", (e) => e.preventDefault())

    taskCtr.addEventListener("drop", (e) => {
        e.preventDefault();

        const draggedEl = document.getElementById(e.dataTransfer.getData("target_id"));
        const swapEl = e.target.closest(".task-ctr-template");

        // Create element position placeholders
        const tempElTarget = document.createElement("div");
        tempElTarget.setAttribute("id", "target-pos");
        taskCtr.insertBefore(tempElTarget, swapEl);

        const tempElSwap = document.createElement("div");
        tempElSwap.setAttribute("id", "target-swap");
        taskCtr.insertBefore(tempElSwap, draggedEl);

        // Clone original elements & add event listeners
        const draggedElClone = draggedEl.cloneNode(true);
        addTaskElListeners(draggedElClone);

        const swapElClone = swapEl.cloneNode(true);
        addTaskElListeners(swapElClone);

        // Remove original elements & Event listeners
        removeTaskElListeners(draggedEl);
        draggedEl.remove();

        removeTaskElListeners(swapEl);
        swapEl.remove();

        // Insert cloned elements
        taskCtr.insertBefore(draggedElClone, tempElTarget);
        taskCtr.insertBefore(swapElClone, tempElSwap);

        // Remove element position placeholders
        tempElTarget.remove();
        tempElSwap.remove();
    })

    function handleDragOnEl(e) {
        e.dataTransfer.setData("target_id", e.target.id);
    }

    function handleCheckBtn(e) {
        const target = e.currentTarget;
        const taskEl = target.closest(".task-ctr-template");
        const filter = document.querySelector("#filter-btn-ctr button.selected").innerHTML;

        if (target.classList.contains("checked")){
            target.classList.remove("checked");
            if (filter === "Completed")             // Update list to correspond to filter
                taskEl.style.display = "none";

        } else {
            target.classList.add("checked");
            if (filter === "Active")                // Update list to correspond to filter
                taskEl.style.display = "none";
        }

        updateTotalActiveTasks();
    }

    function handleDeleteBtn(e) {
        const taskEl = e.target.closest(".task-ctr-template");
        removeTaskElListeners(taskEl);
        taskEl.remove();

        updateTotalActiveTasks();
    }

    function handleFilterTasks(filter) {
        taskCtr.querySelectorAll(".task-ctr-template").forEach(el => {
            el.style.display = "flex";

            let checkBtnClasses = el.querySelector(".check-btn").classList;
            if (filter === "Active" && checkBtnClasses.contains("checked")) {
                el.style.display = "none";
            }
            else if (filter === "Completed" && !checkBtnClasses.contains("checked")) {
                el.style.display = "none";
            }
        });
    }

    function updateTotalActiveTasks() {
        const activeCnt = taskCtr.querySelectorAll(".task-ctr-template .check-btn:not(.checked)").length;
        document.getElementById("total-items").innerHTML = activeCnt;
    }

    function removeTaskElListeners(taskCtrTemplateEl) {
        taskCtrTemplateEl.querySelector(".check-btn").removeEventListener("click", handleCheckBtn);
        taskCtrTemplateEl.querySelector(".delete-btn").removeEventListener("click", handleDeleteBtn);
        taskCtrTemplateEl.removeEventListener("dragstart", handleDragOnEl);
    }

    function addTaskElListeners(taskCtrTemplateEl) {
        taskCtrTemplateEl.querySelector(".check-btn").addEventListener("click", handleCheckBtn);
        taskCtrTemplateEl.querySelector(".delete-btn").addEventListener("click", handleDeleteBtn);
        taskCtrTemplateEl.addEventListener("dragstart", handleDragOnEl);
    }

})