let checky = document.querySelectorAll(".checky");
let dateToper = document.querySelector(".topDate");
let exitTaskBtn = document.querySelector(".exitTaskBtn");
let cancelBtn = document.querySelector(".cancel-btn");
let taskingMenu = document.querySelector(".tasking-menu");
let addTask = document.querySelector(".addingTask");
let progressStatus = document.querySelector(".progress-status");
let progressFill = document.querySelector(".progress-fill");
let taskCounter = document.querySelector(".tasksCounterTop");

//========================================================
//========================================================
//date handler
//========================================================
//========================================================
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let date = new Date();

//========================================================
//========================================================
//end of date handler
//========================================================
//========================================================

// Tasks Data
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Update Data When Document loaded
window.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  handlingClicked();
});

//========================================================
//========================================================
//rendering task
//========================================================
//========================================================

function renderTasks() {
  const list = document.querySelector(".bot-container ul");

  list.innerHTML = `
  
                  <div class="allpage">
                    <div class="title-work" style="display: flex; gap: 8px; margin-bottom: 12px;">
                        <span>Work</span>
                        <span class="workSpanCounter" style="font-size: 12px; width: 23.4px; height: 22px; background-color: #F5F5F5; display: flex; align-items: center; justify-content: center; border-radius: 4px;">0</span>
                    </div>
                    <div class="contentWork" style="margin-bottom: 12px;">
                        
                        
                    </div>



                    <div class="title-personal" style="display: flex; gap: 8px; margin-bottom: 12px;"">
                        <span>Personal</span>
                        <span class="personalSpanCounter" style="font-size: 12px; width: 23.4px; height: 22px; background-color: #F5F5F5; display: flex; align-items: center; justify-content: center; border-radius: 4px;">0</span>
                    </div>
                    <div class="contentPersonal">
                        

                    </div>
                </div>
                
                <div class="workPage">
                    <div class="content">
                        <!--Work TASKS HERE-->

                    </div>
                </div>

                <div class="personalPage">
                    <div class="content">
                        <!--Personal TASKS HERE-->
                    </div>
                </div>                  
                                    
                                    

  `; // clear old

  const allListWork = document.querySelector(".allpage .contentWork");
  const allListPersonal = document.querySelector(".allpage .contentPersonal");
  const workPage = document.querySelector(".workPage .content");
  const personalPage = document.querySelector(".personalPage .content");

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task";
    li.dataset.id = task.id;

    let taskDate = new Date(task.taskDate);

    li.innerHTML = `
               <div class="tasklist" style="text-transform: capitalize;">
                      <span class="checky ${
                        task.completed ? "active-checky" : ""
                      }"><img src="/icons/checkedicon.svg" alt=""></span>
                      <div class="taskdetails">
                          <p style="font-size: 16px; font-weight: 400; ${
                            task.completed
                              ? "text-decoration: line-through; color: #737373;"
                              : " "
                          } " >${task.title}</p>
                          <div class="taskstatus">
                              <p style="font-size: 12px; font-weight: 400; color: #737373; text-transform: capitilize">${
                                task.category
                              }</p>
                              <div class="taskstatus-rt">
                                  <img src="${
                                    task.completed
                                      ? "/icons/caleendarstatuslight.svg"
                                      : "/icons/caleendarstatus.svg"
                                  }" alt="">
                                  <p style="color: #DC2626; font-size: 12px; font-weight: 400; ${
                                    task.completed ? "color: #737373;" : " "
                                  }" >${
      taskDate.getFullYear() === date.getFullYear()
        ? taskDate.getDate() === date.getDate()
          ? "today"
          : taskDate.getMonth() === date.getMonth()
          ? months[date.getMonth()].slice(0, 3) + " " + taskDate.getDate()
          : ""
        : taskDate.getFullYear() >= date.getFullYear()
        ? "Next " +
          parseInt(taskDate.getFullYear() - date.getFullYear()) +
          " Years"
        : "Last " +
          parseInt(date.getFullYear() - taskDate.getFullYear()) +
          " Years"
    }</p>
                              </div>
                          </div>
                          
                      </div>

                      ${
                        task.isFavourite
                          ? '<span class="favstarbtn"><i class="fa-solid fa-star""></i></span>'
                          : ""
                      }
                      
                  </div>   
    `;

    // Checky Listener Clicked
    li.querySelector(".checky").addEventListener("click", () => {
      li.querySelector(".checky").classList.toggle("active-checky");

      const currentTask = tasks.find((t) => t.id === task.id);
      currentTask.completed = li
        .querySelector(".checky")
        .classList.contains("active-checky");

      localStorage.setItem("tasks", JSON.stringify(tasks));

      renderTasks();
      handlingClicked();
    });

    if (task.category == "personal") {
      allListPersonal.appendChild(li);
      const liClone = li.cloneNode(true);
      liClone.className = "task";

      personalPage.appendChild(liClone);

      updateValues();
    } else if (task.category == "work") {
      allListWork.appendChild(li);
      const liClone = li.cloneNode(true);
      liClone.className = "task";

      workPage.appendChild(liClone);
      updateValues();
    }
  });
}

//========================================================
//========================================================
//end of rendering task
//========================================================
//========================================================

exitTaskBtn.addEventListener("click", () => {
  taskingMenu.style.display = "none";
});
cancelBtn.addEventListener("click", () => {
  taskingMenu.style.display = "none";
});

addTask.addEventListener("click", () => {
  taskingMenu.style.display = "block";
});

//========================================================
//========================================================
//Adding Tasks
//========================================================
//========================================================

document.querySelector(".sumbit-btn").addEventListener("click", () => {
  const input = document.querySelector(".add-input");
  const title = input.value.trim();
  const descInput = document.querySelector(
    ".description-container .inpt-card textarea"
  );
  const desc = descInput.value.trim();
  const taskDate = document.querySelector(
    ".duedate-container input[type='date']"
  ).value;
  const category = document.querySelector(
    ".typeoftask-container select[id='typeoftask']"
  ).value;
  const isFavourite = document.querySelector(
    ".sumbit-container .addfavdiv input[type='checkbox']"
  ).checked;

  let temp = new Date(taskDate);
  if (!title) return;
  if (!taskDate || temp.getFullYear() < date.getFullYear()) return;

  const newTask = {
    id: Date.now(), // unique id
    title,
    isFavourite,
    desc,
    category,
    taskDate,
    completed: false,
  };

  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  input.value = "";
  renderTasks();
  updateProgress();
});

//========================================================
//========================================================
//End Of Adding Tasks
//========================================================
//========================================================

function updateValues() {
  const allListPersonalCounter = document.querySelectorAll(
    ".allpage .contentPersonal li"
  ).length;
  const allListWorkCounter = document.querySelectorAll(
    ".allpage .contentWork li"
  ).length;

  document.querySelector(".allpage .title-work .workSpanCounter").textContent =
    allListWorkCounter;
  document.querySelector(
    ".allpage .title-personal .personalSpanCounter"
  ).textContent = allListPersonalCounter;

  taskCounter.textContent = `${
    document.querySelectorAll(".bot-container ul .allpage li").length
  } total • ${
    document.querySelectorAll(".bot-container ul .allpage .active-checky")
      .length
  } completed`;
}

//========================================================
//========================================================
//Handling Clicked
//========================================================
//========================================================

function handlingClicked() {
  let allPage = document.querySelector(".allpage");
  let workPage = document.querySelector(".workPage");
  let personalPage = document.querySelector(".personalPage");

  let allBtn = document.querySelector(".allButtonTop");
  let workBtn = document.querySelector(".workButtonTop");
  let personalBtn = document.querySelector(".personalButtonTop");

  allBtn.classList.add("selectedCategory");

  allBtn.addEventListener("click", () => {
    workPage.style.display = "none";
    personalPage.style.display = "none";
    allPage.style.display = "block";

    allBtn.classList.add("selectedCategory");
    workBtn.classList.remove("selectedCategory");
    personalBtn.classList.remove("selectedCategory");
  });

  workBtn.addEventListener("click", () => {
    workPage.style.display = "block";
    personalPage.style.display = "none";
    allPage.style.display = "none";

    allBtn.classList.remove("selectedCategory");
    workBtn.classList.add("selectedCategory");
    personalBtn.classList.remove("selectedCategory");


    // Checky Listener Clicked

    

  });


  personalBtn.addEventListener("click", () => {
    workPage.style.display = "none";
    personalPage.style.display = "block";
    allPage.style.display = "none";

    allBtn.classList.remove("selectedCategory");
    workBtn.classList.remove("selectedCategory");
    personalBtn.classList.add("selectedCategory");

    tasks.forEach((task) => {
      // Checky Listener Clicked
      document
        .querySelector(".personalPage .checky")
        .addEventListener("click", () => {
          document
            .querySelector(".personalPage .checky")
            .classList.toggle("active-checky");

          const currentTask = tasks.find((t) => t.id === task.id);
          currentTask.completed = document
            .querySelector(".personalPage .checky")
            .classList.contains("active-checky");

          localStorage.setItem("tasks", JSON.stringify(tasks));
        location.reload()
        });
    });

  });
}
