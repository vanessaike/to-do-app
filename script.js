"use strict";

// CLASS
class Task {
  id = (Date.now() + "").slice(-10);
  state;

  constructor(description) {
    this.description = description;
  }
}

// APP
const form = document.querySelector(".form");
const inputTask = document.querySelector(".task-input");
const btnNewTask = document.querySelector(".btn--new-task");
const containerTasks = document.querySelector(".tasks");
const btnReset = document.querySelector(".btn--reset");
let task, taskField;

class App {
  #tasks = [];

  constructor() {
    // get data from local stora
    this._getLocalStorage();

    // attaching event handlers
    form.addEventListener("submit", this._submitTask.bind(this));
    btnReset.addEventListener("click", this._clearTasks.bind(this));
    containerTasks.addEventListener("click", this._deleteTask.bind(this));
    containerTasks.addEventListener("click", this._completeTask.bind(this));
  }

  _submitTask(e) {
    e.preventDefault();
    if (!inputTask.value) return alert("You need to write a task :)");
    // creating new object and adding it to array
    task = new Task(inputTask.value);
    this.#tasks.push(task);
    // adding the markup for the task
    this._createTask(task);
    // clean input field
    inputTask.value = "";
    // set local storage
    this._setLocalStorage();
  }

  _createTask(task) {
    const html = `
    <li class="task ${task.state === "completed" ? "task-complete" : ""}" data-id="${task.id}">
      <p class="task__text">${task.description}</p>
      <div class="task__btns">
        <button class="btn btn--done" aria-label="Complete task"><i class="fas fa-check-square" aria-hidden="true"></i></button>
        <button class="btn btn--delete" aria-label="Delete task"><i class="fas fa-trash-alt" aria-hidden="true"></i></button>
      </div>
    </li>`;

    containerTasks.insertAdjacentHTML("afterbegin", html);
  }

  _clearTasks() {
    // cleaning the array
    this.#tasks.splice(0, this.#tasks.length);
    // cleaning the container
    containerTasks.innerHTML = "";
    // removing from local storage
    localStorage.clear();
  }

  _deleteTask(e) {
    if (e.target.classList.contains("btn--delete")) {
      // selecting the parent
      taskField = e.target.closest(".task");
      // removing it from UI
      taskField.remove();
      // removing from the array
      const taskTarget = this.#tasks.findIndex((task) => task.id === taskField.dataset.id);
      this.#tasks.splice(taskTarget, 1);
      // setting local storage for the current state of the tasks array
      this._setLocalStorage();
    }
  }

  _completeTask(e) {
    if (e.target.classList.contains("btn--done")) {
      // selecting the parent
      taskField = e.target.closest(".task");
      // adding complete task class
      taskField.classList.toggle("task-complete");
      // checking for the state of the task so we can change it if it's coming from local storage
      const taskTarget = this.#tasks.find((task) => task.id === taskField.dataset.id);
      if (taskTarget.state === "completed") {
        taskTarget.state = "";
      } else {
        taskTarget.state = "completed";
      }
      // saving it to local storage
      this._setLocalStorage();
    }
  }

  _setLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.#tasks));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("tasks"));
    if (!data) return;

    // when there's data, we restore the array
    this.#tasks = data;
    this.#tasks.forEach((task) => this._createTask(task));
  }
}
const app = new App();
