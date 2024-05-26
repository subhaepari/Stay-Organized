window.onload = init();

var serverLocation;

function init() {
  // location.search returns the query string part of the URL
  const urlParams = new URLSearchParams(location.search);
  console.log("init  url param " + urlParams);

  let username = "";
  if (urlParams.has("loginusername")) {
    username = urlParams.get("loginusername");
    // call a method that fetches this course
    console.log("login username is " + username);
  }

  serverLocation = "http://localhost:8083";
  const usersList = document.getElementById("usersList");
  initUsersDropdown(usersList, username, true);

  let allOption = new Option("All", 0);
  usersList.appendChild(allOption);
  usersList.onchange = onChangeUsersDropdown;

  let categoryList = document.getElementById("categoryList");
  let priorityList = document.getElementById("priorityList");

  categoryList.onchange = onChangeDropdowns;
  priorityList.onchange = onChangeDropdowns;

  //Initialize layout format
  initLayout();

  //Initializing content on the offcanvas for creating new tasks
  createNewTaskFormInit();


  //Initial default fetch of tasks after login
  //onChangeUsersDropdown(); //Won't work as the userlist async task would still be pending and userlist not yet initialized
  //fetchTasksForUser(username); //won't work, need to pass user id 
  // alert("Exiting init window onload");
}

function initUsersDropdown(list, username, fetchtasks) {
  console.log("Entered initUsersDropdown...");
  //let taskRowDiv = document.getElementById("taskRowDiv");

  //alert("initUsersDropdown...server location: "+ `${serverLocation}/api/users`);

  fetch(`${serverLocation}/api/users`)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        let theOption = new Option(data[i].name, data[i].id);
        if (data[i].username === username)
          theOption.setAttribute("selected", "selected");

        list.appendChild(theOption);
      }

      //Required for page initialization with tasks after page load
      //As it can be done only after user list is loaded
      if(fetchtasks){
        const usersList = document.getElementById("usersList");
        let selectedUser = usersList.value;
        fetchTasksForUser(selectedUser);
      }
    })
    .catch((error) => {
      console.log("Caught exception while fetching users");
    });
}

function onChangeUsersDropdown() {
  const usersList = document.getElementById("usersList");
  let selectedUser = usersList.value;

  let categoryList = document.getElementById("categoryList");
  let priorityList = document.getElementById("priorityList");
  categoryList.value = "All Categories";
  priorityList.value = "All Priorities";

  fetchTasksForUser(selectedUser);
}

function onChangeDropdowns() {
  const usersList = document.getElementById("usersList");
  let selectedUser = usersList.value;
  fetchTasksForUser(selectedUser);
}

function fetchTasksForUser(selectedUser) {
  console.log("Entered fetchTasksForUser..." + selectedUser);

  let fetchurl = "";

  //fetch tasks for all users if selected user is not a valid id
  if (selectedUser < 1) fetchurl = `${serverLocation}/api/todos`;
  else fetchurl = `${serverLocation}/api/todos/byuser/` + selectedUser;

  let taskRowDiv = document.getElementById("taskRowDiv");
  clearDiv(taskRowDiv);

  let table = document.getElementById("taskTable");
  table.innerHTML = "";

  let category = document.getElementById("categoryList").value;
  let priority = document.getElementById("priorityList").value;
  //alert(`${category} ${priority}`);

  fetch(fetchurl)
    .then((response) => response.json())
    .then((data) => {
      //filter tasks by category and priority

      if (category != "All Categories" || priority != "All Priorities") {
        // filteredtasks = data.filter((task)=>{task.category === category && task.priority === priority});
        filteredtasks = data.filter((task) => {
          return taskfilter(task, category, priority);
        });
      } else filteredtasks = data;

      for (let i = 0; i < filteredtasks.length; i++) {
        //Adding task to task board
        taskRowDiv.appendChild(createCard(filteredtasks[i]));

        //Adding task to task list
        addTasktoTable(table, filteredtasks[i]);
      }
    })
    .catch((error) => {
      console.log("Caught exception while fetching tasks for user." + error);
    });
}

function taskfilter(task, category, priority) {
  //alert("Task Filter   :    "+`${category} ${priority}`);

  if (task.category === category && task.priority === priority) return true;
  if (category === "All Categories" && task.priority === priority) return true;
  if (task.category === category && priority === "All Priorities") return true;
  return false;
}

// function btnFetchTasksClick() {
//   console.log("Entered btnFetchTasksClick...");
//   let taskRowDiv = document.getElementById("taskRowDiv");
//   clearDiv(taskRowDiv);

//   fetch(`${serverLocation}/api/todos`)
//     .then((response) => response.json())
//     .then((data) => {
//       for (let i = 0; i < data.length; i++) {
//         taskRowDiv.appendChild(createCard(data[i]));
//       }
//     })
//     .catch((error) => {
//       console.log("Caught exception while fetching tasks");
//     });
// }

function clearTable(table) {}

function addTasktoTable(table, task) {
  let row = table.insertRow(-1);

  let priorityCell = row.insertCell(0);
  let descCell = row.insertCell(1);
  let statusCell = row.insertCell(2);
  let detailsCell = row.insertCell(3);
  let deleteCell = row.insertCell(4);
  //let editCell = row.insertCell(4);
  let reassignCell = row.insertCell(5);

  let priorityImage = `<img src="images/Hopstarter-Soft-Scraps-Button-Blank-Blue.24.png" />`;
  if (task.priority === "Medium")
    priorityImage = `<img src="images/Hopstarter-Soft-Scraps-Button-Blank-Yellow.24.png" />`;
  else if (task.priority === "High")
    priorityImage = `<img src="images/Hopstarter-Soft-Scraps-Button-Blank-Red.24.png" />`;

  priorityCell.innerHTML = priorityImage;
  // priorityCell.innerHTML = `<img src="images/Hopstarter-Soft-Scraps-Button-Blank-Red.32.png" />`;

  let statusChkLabel = document.createElement("label");
  statusChkLabel.classList.add("taskstatuschk-container");

  let statusChk = document.createElement("input");
  //anchor.href = `details.html?taskid=${task.id}`;
  statusChk.type = `checkbox`;
  statusChk.title = "Task Completion Status";
  statusChk.checked = task.completed;

  //statusChk.onchange = updateTaskStatus
  //statusCell.checked = task.completed?'done':'undone';

  statusChk.addEventListener("change", (event) => {
    updateTaskStatus(event, task.id);
  });

  statusChkLabel.appendChild(statusChk);

  // let detailanchor = document.createElement("a");
  // //anchor.href = `details.html?taskid=${task.id}`;
  // detailanchor.href = `#taskdetail`;
  // detailanchor.text = "See details";

  // let detaillink = document.createElement("input");
  // detaillink.type = "button";
  // detaillink.setAttribute(data-toggle, "modal" );
  // detaillink.setAttribute(data-target, "#exampleModalCenter" );

  let detail = `<a href="javascript:(void)" title="See Detail" 
                      data-bs-taskid="${task.id}"
                      data-bs-category="${task.category}"
                      data-bs-description="${task.description}"
                      data-bs-deadline="${task.deadline}"
                      data-bs-priority="${task.priority}" 
                      data-bs-completed="${task.completed}"
                      data-bs-toggle="modal" 
                      data-bs-target="#taskDetailModal">
                      <img src="images/Fatcow-Farm-Fresh-Application-view-detail.24.png" />
                      </a>`;

  //<i class="fa fa-list"></i>

  let delanchor = document.createElement("a");
  delanchor.href = `javascript:deleteTask(${task.id})`;
  //delanchor.text = "Delete";

  delanchor.innerHTML = `<img src="images/Robinweatherall-Recycling-Bin-small.24.png" />`;
  //delanchor.innerHTML = `<i class="fa fa-trash"></i>`;
  delanchor.title = "Delate Task";

  let editanchor = document.createElement("a");
  editanchor.href = `javascript:editTask(${task.id})`;
  editanchor.text = "Edit";

  // let reassignanchor = document.createElement("a");
  // reassignanchor.href = `javascript:reassignTask(${task.id})`;
  // reassignanchor.text = "Re-assign user";

  let userlist = document.createElement("select");
  userlist.name = "reassign-userlist";
  userlist.innerHTML = '<option value="">Reassign to...</option>';
  userlist.classList.add("reassign-userlist");
  userlist.addEventListener(
    "click",
    () => {
      initUsersDropdown(userlist);
    },
    { once: true }
  );

  userlist.addEventListener("change", (event) => {
    reassignUser(event, task.id);
  });

  descCell.innerHTML = task.description;

  statusCell.appendChild(statusChkLabel);
  //statusCell.appendChild(statusChk);

  //detailsCell.appendChild(detailanchor);
  // detailsCell.appendChild(detaillink);
  detailsCell.innerHTML = detail;

  deleteCell.appendChild(delanchor);
  // editCell.appendChild(editanchor);
  reassignCell.appendChild(userlist);
}

function createCard1(task) {
  console.log("entered create card");

  const colDiv = document.createElement("div");
  colDiv.classList.add("col-md-4");
  colDiv.classList.add("mb-4");

  const card = document.createElement("div");
  card.classList.add("card");

  const cardTitle = document.createElement("h2");
  cardTitle.textContent = task.description;

  const cardCategory = document.createElement("p");
  cardCategory.textContent = task.category;

  const cardDeadline = document.createElement("p");
  cardDeadline.textContent = task.deadline;

  card.appendChild(cardTitle);
  card.appendChild(cardCategory);
  card.appendChild(cardDeadline);

  colDiv.appendChild(card);

  return colDiv;
}

function createCard(task) {
  console.log("entered create card");

  const colDiv = document.createElement("div");
  colDiv.classList.add("col-md-4");
  colDiv.classList.add("content-card");
  colDiv.classList.add("mb-4");
  // colDiv.classList.add("mx-auto");
  // colDiv.classList.add("center-block");

  const shadowDiv = document.createElement("div");
  shadowDiv.classList.add("card-big-shadow");

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  cardDiv.classList.add("card-just-text");
  cardDiv.setAttribute("data-background", "color");
  cardDiv.setAttribute("data-color", "teal");
  cardDiv.setAttribute("data-radius", "none");

  const contentDiv = document.createElement("div");
  contentDiv.classList.add("content");

  const categoryElement = document.createElement("p");
  categoryElement.textContent = task.category;
  categoryElement.classList.add("category");
  categoryElement.classList.add("mb-4");

  const descElement = document.createElement("p");
  descElement.textContent = task.description;
  descElement.classList.add("description");
  descElement.classList.add("mb-4");

  let deadlineColor = "text-primary";
  const deadlineElement = document.createElement("p");
  deadlineElement.innerHTML =
    "Due by " + `<span class=${deadlineColor}>${task.deadline}</span>`;
  deadlineElement.classList.add("common");
  deadlineElement.classList.add("mb-4");

  let priorityColor = "text-secondary";
  if (task.priority === "Medium") priorityColor = "text-warning";
  else if (task.priority === "High") priorityColor = "text-danger";

  const priorityElement = document.createElement("p");
  priorityElement.innerHTML =
    "Priority: " + `<span class=${priorityColor}>${task.priority}</span>`;
  priorityElement.classList.add("common");
  priorityElement.classList.add("mb-4");
  //priorityElement.classList.add("text-danger");
  //priorityElement.classList.add("text-secondary");

  contentDiv.appendChild(categoryElement);
  contentDiv.appendChild(descElement);
  contentDiv.appendChild(deadlineElement);
  contentDiv.appendChild(priorityElement);

  let statusChkLabel = document.createElement("label");
  statusChkLabel.classList.add("taskstatuschk-container");

  let statusChk = document.createElement("input");
  //anchor.href = `details.html?taskid=${task.id}`;
  statusChk.type = `checkbox`;
  statusChk.title = "Task Completion Status";
  statusChk.checked = task.completed;

  statusChk.addEventListener("change", (event) => {
    updateTaskStatus(event, task.id);
  });

  statusChkLabel.appendChild(statusChk);

  contentDiv.appendChild(statusChkLabel);

  colDiv.appendChild(shadowDiv);
  shadowDiv.appendChild(cardDiv);
  cardDiv.appendChild(contentDiv);

  return colDiv;
}

function clearDiv(div) {
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

/****************** Create New Task ************* */

function createNewTaskFormInit() {
  console.log("Entered createNewTaskFormInit...");
  const usersListForNewTask = document.getElementById("usersListForNewTask");
  initUsersDropdown(usersListForNewTask);

  // const categoriesForNewTask = document.getElementById("categoriesForNewTask");
  initCategoriesDropdowns();
}

function initCategoriesDropdowns() {
  console.log("Entered initFormCategoriesDropdown...");
  const categoriesDropdown = document.getElementById("categoriesForNewTask");
  const categoryList = document.getElementById("categoryList");

  fetch(`${serverLocation}/api/categories`)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        let theOptionforTaskForm = new Option(data[i].name, data[i].name);
        let theOptionforMain = new Option(data[i].name, data[i].name);
        categoriesDropdown.appendChild(theOptionforTaskForm);
        categoryList.appendChild(theOptionforMain);
      }
    })
    .catch((error) => {
      console.log("Caught exception while fetching categories");
    });
}

function createNewTask() {
  console.log("entered create new task");
  //alert("entered create new task");
  let newTaskObj = {
    userid: document.getElementById("usersListForNewTask").value,
    category: document.getElementById("categoriesForNewTask").value,
    description: document.getElementById("descriptionForNewTask").value,
    deadline: document.getElementById("deadlineForNewTask").value,
    priority: document.getElementById("priorityForNewTask").value,
    completed: false,
  };

  //alert("New task to create: " + JSON.stringify(newTaskObj));

  fetch(`${serverLocation}/api/todos`, {
    method: "POST",
    body: JSON.stringify(newTaskObj),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log("created new task successfully with id :" + json.id);

      if (json.id === undefined || json.id === null) {
        console.log("Task could not be added.");
        throw "Task could not be added.";
      }

      console.log("created new task successfully with id :" + json.id);

      let confirmationMessage = document.getElementById("add-task-message");
      confirmationMessage.innerHTML = "Added Task Successfully";
    })
    .catch((err) => {
      // If the POST returns an error, display a message
      let confirmationMessage = document.getElementById(
        "add-task-error-message"
      );
      confirmationMessage.innerHTML = err;

      console.log("Caught unexpected error while creating new task:" + err);
    });
}

function updateTaskStatus(event, taskid) {
  taskstatus = event.target.checked? true:false;
   
  console.log(
    `Going to update task with id ${taskid} to status completed as ${taskstatus}`
  );

  //update task status

  let updateTaskObj = {
    id: taskid,
    completed: taskstatus,
  };

  //This rest API just toggles the status irrespective of the status passed
  fetch(`${serverLocation}/api/todos/` + taskid, {
    method: "PUT",
    body: JSON.stringify(updateTaskObj),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json())
    .then((json) => {
      if (taskstatus == json.completed) {
        console.log(
          `Updated task status successfully to completed: ${json.completed}`
        );
       // var element = document.querySelector('.toast');
        element = document.getElementById('success-toast');
        var toast = new bootstrap.Toast(element);
        toast.show();

      } else 
          throw "Could not update task status";
    })
    .catch((err) => {
        element = document.getElementById('failure-toast');
        var toast = new bootstrap.Toast(element);
        toast.show();
        console.log(
        "Caught unexpected error while re-assigning new user to task:" + err
      );
    });
}

//Not supported by the Rest API
function reassignUser(event, taskid) {
  userid = event.target.value;
  if (userid < 1) {
    console.log(`Quitting reassign as user id is not valid`);
    return;
  }

  console.log(
    `Going to reassign task with id ${taskid} to user with id ${userid}`
  );

  //update task to reassign user

  let updateTaskObj = {
    id: taskid,
    userid: userid,
  };

  console.log(" Task to update: " + JSON.stringify(updateTaskObj));

  fetch(`${serverLocation}/api/todos/` + taskid, {
    method: "PUT",
    body: JSON.stringify(updateTaskObj),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json())
    .then((json) => {
      //Right now put supports only change in complete status
      // json  retured only has task id and completed status
      console.log("Reassigned task to new user is not supported");
      //alert("Reassigned task to new user" + json.id);
    })
    .catch((err) => {
      console.log(
        "Caught unexpected error while re-assigning new user to task:" + err
      );
    });
}

//Not supported by the Rest API
function deleteTask(taskid) {
  console.log("entered delete task for task id: " + taskid);
  fetch(`${serverLocation}/api/todos/` + taskid, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((json) => {
      console.log("created new task successfully with id :" + json.id);
      //alert("created new task successfully with id :" + json.id);
    })
    .catch((err) => {
      // If the POST returns an error, display a message
      let confirmationMessage = document.getElementById(confirmationMessage);
      confirmationMessage.innerHTML = "Unexpected error";

      console.log("Caught unexpected error while created new task:" + err);
    });
}

function initLayout() {
  let checkBox = document.getElementById("listlayoutchk");
  checkBox.checked = true;

  // Get the output text
  let listDiv = document.getElementById("taskListDiv");
  let cardDiv = document.getElementById("taskBoardDiv");

  listDiv.style.display = "block";
  cardDiv.style.display = "none";
}

function onChangeChkBox() {
  // Get the checkbox
  let checkBox = document.getElementById("listlayoutchk");
  // Get the output text
  let listDiv = document.getElementById("taskListDiv");

  let cardDiv = document.getElementById("taskBoardDiv");
  // alert("checkbox state " + checkBox.checked);
  // If the checkbox is checked, display the output text
  if (checkBox.checked == true) {
    listDiv.style.display = "block";
    cardDiv.style.display = "none";
  } else {
    listDiv.style.display = "none";
    cardDiv.style.display = "block";
  }
}

//Adding event listner to task detail modal on show of modal

var taskDetailModal = document.getElementById("taskDetailModal");
taskDetailModal.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  var button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  var taskid = button.getAttribute("data-bs-taskid");
  var category = button.getAttribute("data-bs-category");
  var deadline = button.getAttribute("data-bs-deadline");
  var priority = button.getAttribute("data-bs-priority");
  var completed = button.getAttribute("data-bs-completed");
  var description = button.getAttribute("data-bs-description");

  console.log(`Displaying task with id ${taskid} in modal`);

  var modalCategory = document.getElementById("modaltaskcategory");
  modalCategory.innerText = category;

  var modalDesc = document.getElementById("modaltaskdesc");
  modalDesc.innerText = description;

  let deadlineColor = "text-primary";
  var modalDeadline = document.getElementById("modaltaskdeadline");
  modalDeadline.innerHTML =  "Due by " + `<span class=${deadlineColor}>${deadline}</span>`;


  let priorityColor = "text-secondary";
  if (priority === "Medium") priorityColor = "text-warning";
  else if (priority === "High") priorityColor = "text-danger";

  var modalPriority = document.getElementById("modaltaskpriority");
  modalPriority.innerHTML = "Priority: " + `<span class=${priorityColor}>${priority}</span>`;
});
