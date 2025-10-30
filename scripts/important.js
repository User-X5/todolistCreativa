let checky = document.querySelectorAll(".checky");
let dateToper = document.querySelector(".topDate");
let exitTaskBtn = document.querySelector(".exitTaskBtn");
let cancelBtn = document.querySelector(".cancel-btn");
let taskingMenu = document.querySelector(".tasking-menu");
let addTask = document.querySelector(".addingTask");
let progressStatus = document.querySelector(".progress-status");
let progressFill = document.querySelector(".progress-fill");
let importantCounter = document.querySelector('.importantCounter');
let importantStatus = document.querySelector('.importantStatus');


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




//========================================================
//========================================================
//Counting Starred Tasks
//========================================================
//========================================================

let impotentTasks = 0;
tasks.forEach(t => {
  if(t.isFavourite) {
    impotentTasks++;
    }
  });
importantCounter.textContent = `${impotentTasks} tasks starred`;


// Update Data When Document loaded
window.addEventListener("DOMContentLoaded", () => {
  

  renderTasks();
  updateProgress();
});



//========================================================
//========================================================
//rendering task
//========================================================
//========================================================

function renderTasks() {
  const list = document.querySelector(".bot-container ul");
  list.innerHTML = ""; // clear old

  tasks.forEach((task) => {
    if(task.isFavourite){
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

      updateProgress();
      renderTasks();

    }
    );
    
    list.appendChild(li);
}});
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
//updating progress
//========================================================
//========================================================

function updateProgress() {
  const total = tasks.filter(t => t.isFavourite).length;
  const done = tasks.filter(t => t.completed).length;

  if(total != 0){
    importantStatus.textContent = `${done} of ${total} Completed`
  }else {
    importantStatus.textContent = `No Starred Tasks Found !`;
  }
}

//========================================================
//========================================================
//end of updating progress
//========================================================
//========================================================


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
  const isFavourite = true;
 

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