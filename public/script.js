// we are gonna create two classes
// 1) class App : which's the class is responsible to manage the app
// 2) class task : which's the class is responsible about creating , updating , deleting , tasks

// Selectors
const addTaskBtns = document.querySelectorAll(".addTaskBtn");
const containerOfTasks = document.querySelector(".containerOfTasks");
const focusBtn = document.querySelector(".focus");

class Task {
  static tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  constructor(name = "", duration = 30) {
    this.id = this.generateTaskId();
    this.name = name;
    this.duration = duration;

    // boolean properties
    this.isRepeated = false;
    this.isCompeleted = false;
    this.isSatAsRest = false;
    this.isSatForLater = false;
  }

  generateTaskId() {
    return "id-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  }

  static updateName(name, taskObj) {
    taskObj.name = name;

    // set the item in the local storage
    Task.setLocalStorage(taskObj);
  }

  static updateDuration(duration, taskObj) {
    taskObj.duration = duration;

    Task.setLocalStorage(taskObj);
  }

  static completeTask(taskObj) {
    taskObj.isCompeleted = true;
    Task.setLocalStorage(taskObj);
  }

  static setLocalStorage(taskObj) {
    const id = taskObj.id;

    Task.tasks = Task.tasks.map((task) => (task.id === id ? taskObj : task));

    localStorage.setItem("tasks", JSON.stringify(Task.tasks));
  }

  static deleteTask(task_id) {
    const id = task_id;

    Task.tasks = Task.tasks.filter((task) => task.id !== id);

    localStorage.setItem("tasks", JSON.stringify(Task.tasks));
  }

  static getTask(task_id) {
    const task = Task.tasks.find((task) => task.id === task_id);
    return task;
  }
}

class App {
  constructor() {
    // initlize the event listeners
    addTaskBtns.forEach((btn) => btn.addEventListener("click", this.createTask.bind(this)));

    // render tasks
    this.renderTasks();
    if (containerOfTasks.querySelectorAll(".task").length === 0) {
      this.handleLastTask();
    }
  }

  renderTasks() {
    // CHANGE LATER
    Task.tasks.forEach((task) => this.generateTaskTemplate(task));
  }

  createTask() {
    const task = new Task();
    Task.tasks.push(task);

    this.generateTaskTemplate(task);

    // add hidden
    const taskEl = containerOfTasks.querySelector(`.task[task_id="${task.id}"]`);
    taskEl.querySelector(".durationOfTask").classList.add("hidden");
    taskEl.querySelector(".info").classList.add("hidden");
  }
  // doLaterBtn , repeatBtn , completeBtn , resetBtn , deleteBtn
  generateTaskHTML(task) {
    return `
        <div class="task" task_id="${task.id}">
            <input type="text" class="taskName" value="${task.name ? task.name : ""}"/>
            <div class="info">
                <div class="durationOfTask">${task.duration}m</div>
                <input type="text" class="taskDuration" value="${task.duration}" />
                <div titlePopUp="options" class="options">
                    <img src="./imgs/more (1).png" alt="" srcset="" />
                    <div class="operationPopUps">
                        ${this.returnOpeartions(task)}
                    </div>
                </div>
            </div>
        </div>
    `;
  }

  generateTaskTemplate(task) {
    const html = this.generateTaskHTML(task);
    containerOfTasks.insertAdjacentHTML("beforeend", html);
    const taskEl = containerOfTasks.querySelector(`.task[task_id="${task.id}"]`);
    this.addEventListeners(taskEl);
  }

  renderTask(taskEl, task) {
    taskEl.outerHTML = this.generateTaskHTML(task);
    // add event listeners
  }

  getTask(id) {
    const task = Task.tasks.find((task) => task.id === id);
    return task;
  }

  addEventListeners(taskEl) {
    // doLaterBtn , repeatBtn , completeBtn , resetBtn , deleteBtn
    const inputName = taskEl.querySelector(".taskName");
    const inputDuration = taskEl.querySelector(".taskDuration");
    const deleteBtn = taskEl.querySelector(".deleteBtn");
    const completeBtn = taskEl.querySelector(".completeBtn");
    const doItLaterBtn = taskEl.querySelector(".doLaterBtn");
    const repeatBtn = taskEl.querySelector(".doLaterBtn");
    const resetBtn = taskEl.querySelector(".resetBtn");

    inputName.focus();

    // add event lsiteners
    inputName.addEventListener("input", this.handleInputEventForName.bind(this));
    inputName.addEventListener("blur", this.handleBlurEventForName.bind(this));
    inputName.addEventListener("change", this.handleChangeEventForName.bind(this));
    inputDuration.addEventListener("change", this.handleChangeEventForDuration.bind(this));
    deleteBtn.addEventListener("click", this.handleDeleteBtn.bind(this));
    if (completeBtn) completeBtn.addEventListener("click", this.handleCompleteTaskBtn.bind(this));

    console.log(completeBtn);
  }

  returnOpeartions(task) {
    let html = ``;

    if (!task.isSatForLater) {
      html += ` 
      <div titlePopUp="Do it Later" class="doLaterBtn">
        <img src="./imgs/icons8-save.svg" alt="" srcset="" />
      </div>`;
    } else {
      // add them and return
    }

    if (!task.isRepeated) {
      html += `
        <div titlePopUp="Set Repeat" class="repeatBtn">
         <img src="./imgs/repeat-svgrepo-com (1).svg" alt="" srcset="" />
        </div>
      `;
    } else {
      html += `
        <div titlePopUp="remove Repeat" class="removeRepeatBtn">
         <img src="./imgs/arrow-repeat-all-off-svgrepo-com.svg" alt="" srcset="" />
        </div>
      `;
    }

    if (!task.isCompeleted) {
      html += `
          <div titlePopUp="Complete" class="completeBtn">
            <img src="./imgs/icons8-check-mark.svg" alt="" srcset="" />
          </div>
      `;
    } else {
      html += `
      <div titlePopUp="Redo" class="reDoBtn">
        <img src="./imgs/redo-arrows-svgrepo-com.svg" alt="" srcset="" />
      </div> `;
    }

    if (!task.isSatAsRest) {
      html += `
        <div titlePopUp="Set Break " class="setBreakBtn ${task.isCompeleted ? "hidden" : ""}">
            <img src="./imgs/coffee-cup-svgrepo-com.svg" alt="" srcset="" /> 
        </div>
      `;
    } else {
      html += `
      <div titlePopUp="remove Break" class="removeBreakBtn ${task.isCompeleted ? "hidden" : ""}">
          <img src="./imgs/coffee-icon-svgrepo-com.svg" alt="" srcset="" /> 
      </div> `;
    }

    html += `
      <div titlePopUp="Delete" class="deleteBtn">
        <img src="./imgs/rubbish-bin-svgrepo-com.svg" alt="" srcset="" />
      </div>
    `;

    return html;
  }

  handleInputEventForName(e) {
    const target = e.target;

    const task = target.closest(".task");
    if (target.value.trim() === "") {
      return;
    }

    const info = task.querySelector(".info");

    info.classList.remove("hidden");
  }

  handleBlurEventForName(e) {
    const target = e.target;
    const task = target.closest(".task");
    const taskId = task.getAttribute("task_id");

    if (target.value.trim() === "") {
      // remove the whole task
      Task.deleteTask(taskId);
      task.outerHTML = "";
      if (containerOfTasks.querySelectorAll(".task").length === 0) this.handleLastTask();
      return;
    }

    task.querySelector(".durationOfTask").classList.remove("hidden");
  }

  handleChangeEventForName(e) {
    const target = e.target;
    console.log("from change");
    if (target.value.trim() === "") {
      // remove task and return
      return;
    }
    focusBtn.classList.remove("hide");
    const task = target.closest(".task");
    const taskId = task.getAttribute("task_id");
    console.log(taskId);

    const taskObj = Task.getTask(taskId);
    console.log(taskObj);
    // otherwise update it
    Task.updateName(target.value, taskObj);

    console.log(JSON.parse(localStorage.getItem("tasks")));
  }

  handleChangeEventForDuration(e) {
    const target = e.target;
    const task = target.closest(".task");
    const taskId = task.getAttribute("task_id");
    const taskObj = Task.getTask(taskId);

    let newDuration = Number(target.value.trim());
    if (target.value.trim() === "" || isNaN(newDuration)) {
      // set task as 30
      newDuration = 30;
    }
    newDuration = Math.trunc(newDuration);
    Task.updateDuration(newDuration, taskObj);
    target.value = newDuration;
    // change later
    task.querySelector(".durationOfTask").textContent = `${newDuration}m`;
  }

  handleDeleteBtn(e) {
    const target = e.target;
    const task = target.closest(".task");
    const taskId = task.getAttribute("task_id");
    Task.deleteTask(taskId);

    task.classList.add("slideUp"); // Add the animation class

    setTimeout(() => {
      task.outerHTML = ""; // Remove the card after the animation completes
      if (containerOfTasks.querySelectorAll(".task").length === 0) {
        this.handleLastTask();
      }
    }, 200); // Match the duration of the transition

    // 3. adjust the clock
  }

  handleCompleteTaskBtn(e) {
    // 1. select the elements
    const target = e.target;
    const task = target.closest(".task");
    const taskId = task.getAttribute("task_id");
    const taskObj = Task.getTask(taskId);
    // 2. complete the task
    Task.completeTask(taskObj);
    // 3. do some effects
    task.classList.add("completed");

    // 4. change the functionalities
    this.renderTask(task, taskObj);

    // 5. adjust the clock
  }

  handleLastTask() {
    this.createTask();
    console.log(focusBtn);
    focusBtn.classList.add("hide");
  }
}

const app = new App();
