let checky = document.querySelectorAll(".checky");
let dateToper = document.querySelector(".topDate");
let exitTaskBtn = document.querySelector(".exitTaskBtn");
let cancelBtn = document.querySelector(".cancel-btn");
let taskingMenu = document.querySelector(".tasking-menu");
let addTask = document.querySelector(".addingTask");
let progressStatus = document.querySelector(".progress-status");
let progressFill = document.querySelector(".progress-fill");
let plannedCounter = document.querySelector('.plannedCounter');


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
});

plannedCounter.textContent = `${tasks.length} tasks scheduled`

//========================================================
//========================================================
//rendering task
//========================================================
//========================================================

function renderTasks() {
  const list = document.querySelector(".bot-container ul");

  

  list.innerHTML = `
  
                                    <div class="overDueDiv">
                                        <div class="title">
                                            <p>Overdue</p> <span>0</span>
                                        </div>
                                        <div class="content">
                                            
                                        </div>
                                    </div>

                                    <div class="todayDiv">
                                        <div class="title">
                                            <p>Today</p> <span>0</span>
                                        </div>
                                        <div class="content">

                                        </div>
                                    </div>
                                    <div class="tomorrowDiv">
                                        <div class="title">
                                            <p>Tomorrow</p> <span>0</span>
                                        </div>
                                        <div class="content">

                                        </div>
                                    </div>
                                    <div class="thisWeekDiv">
                                        <div class="title">
                                            <p>This Week</p> <span>0</span>
                                        </div>
                                        <div class="content">

                                        </div>
                                    </div>

  `; // clear old

  const todayList = document.querySelector(".todayDiv .content");
  const overdueList = document.querySelector(".overDueDiv .content");
  const tomorrowList = document.querySelector(".tomorrowDiv .content");
  const thisWeekList = document.querySelector(".thisWeekDiv .content");

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
                          <p style="font-size: 16px; font-weight: 400; ${(task.completed) ? "text-decoration: line-through; color: #737373;" : ' '} " >${
                            task.title
                          }</p>
                          <div class="taskstatus">
                              <p style="font-size: 12px; font-weight: 400; color: #737373; text-transform: capitilize">${task.category}</p>
                              <div class="taskstatus-rt">
                                  <img src="${(task.completed) ? "/icons/caleendarstatuslight.svg" : '/icons/caleendarstatus.svg'}" alt="">
                                  <p style="color: #DC2626; font-size: 12px; font-weight: 400; ${(task.completed) ? "color: #737373;" : ' '}" >${  taskDate.getFullYear() === date.getFullYear() ?  
                                    (taskDate.getDate() === date.getDate() ? 'today' : (taskDate.getMonth() === date.getMonth() ) ? months[date.getMonth()].slice(0,3) + ' ' + taskDate.getDate() : '') :
                                     taskDate.getFullYear() >= date.getFullYear() ? 'Next ' + parseInt( taskDate.getFullYear() - date.getFullYear() ) + ' Years'  :
                                      'Last ' + parseInt( date.getFullYear() - taskDate.getFullYear() ) + ' Years'}</p>
                              </div>
                          </div>
                          
                      </div>

                      ${(task.isFavourite)  ? '<span class="favstarbtn"><i class="fa-solid fa-star""></i></span>' : ''}
                      
                  </div>   
    `
    ;




    // Checky Listener Clicked
    li.querySelector(".checky").addEventListener("click", () =>{

      li.querySelector(".checky").classList.toggle('active-checky');

      const currentTask = tasks.find(t => t.id === task.id);
      currentTask.completed = li.querySelector(".checky").classList.contains("active-checky");
    
      localStorage.setItem("tasks", JSON.stringify(tasks));

      renderTasks();

    }
    );
    

    const startOfToday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startOfTask = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
    const diffDays = Math.round((startOfTask - startOfToday) / 86400000);

    if (diffDays === 0) {
        todayList.appendChild(li);
        updateValues();
    } else if (diffDays < 0) {
        overdueList.appendChild(li);
        updateValues();
    } else if (diffDays === 1) {
        tomorrowList.appendChild(li);
        updateValues();
    } else if (diffDays >= 2 && diffDays <= 7) {
        thisWeekList.appendChild(li);
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

document.querySelector('.sumbit-btn').addEventListener("click", () => {

  const input = document.querySelector(".add-input");
  const title = input.value.trim();
  const descInput = document.querySelector(".description-container .inpt-card textarea");
  const desc = descInput.value.trim();
  const taskDate = document.querySelector(".duedate-container input[type='date']").value;
  const category = document.querySelector(".typeoftask-container select[id='typeoftask']").value;
  const isFavourite = document.querySelector(".sumbit-container .addfavdiv input[type='checkbox']").checked;
 

  let temp = new Date(taskDate);
  if (!title) return;
  if(!(taskDate) || temp.getFullYear() < date.getFullYear()) return;



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
    const overDueDivCounter = document.querySelectorAll(".bot-container .overDueDiv .content li").length;
    const todayListCounter = document.querySelectorAll(".bot-container .todayDiv .content li").length;
    const tomorrowListCounter = document.querySelectorAll(".bot-container .tomorrowDiv .content li").length;
    const thisWeekListCounter = document.querySelectorAll(".bot-container .thisWeekDiv .content li").length;


    document.querySelector(".bot-container .overDueDiv .title span").textContent = overDueDivCounter;
    document.querySelector(".bot-container .todayDiv .title span").textContent = todayListCounter;
    document.querySelector(".bot-container .tomorrowDiv .title span").textContent = tomorrowListCounter;
    document.querySelector(".bot-container .thisWeekDiv .title span").textContent = thisWeekListCounter;
} 