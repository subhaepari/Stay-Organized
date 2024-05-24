window.onload = init();

var serverLocation;

function init() {
  // console.log("init  url param "+ urlParams);
  //  // location.search returns the query string part of the URL
  // const urlParams = new URLSearchParams(location.search);

  // let username = "";
  // if (urlParams.has("loginusername") === true)
  // {
  //     username = urlParams.get("loginusername")
  //     // call a method that fetches this course
  //     console.log("login username is " + username);
  // }

  serverLocation = "http://localhost:8083";
  const usersList = document.getElementById("usersList");
  initUsersDropdown(usersList);

  let allOption = new Option("All Users", 0);
  usersList.appendChild(allOption);

  usersList.onchange = onChangeUsersDropdown;

  //Initialize layout format
  initLayout();

  //Initializing content on the offcanvas for creating new tasks
  createNewTaskFormInit();

  // alert("Exiting init window onload");
}

function initUsersDropdown(list) {
  console.log("Entered initUsersDropdown...");
  //let taskRowDiv = document.getElementById("taskRowDiv");

  //alert("initUsersDropdown...server location: "+ `${serverLocation}/api/users`);

  fetch(`${serverLocation}/api/users`)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        let theOption = new Option(data[i].name, data[i].id);
        list.appendChild(theOption);
      }
    })
    .catch((error) => {
      console.log("Caught exception while fetching users");
    });
}

function onChangeUsersDropdown() {
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

  fetch(fetchurl)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        //Adding task to task board
        taskRowDiv.appendChild(createCard(data[i]));

        //Adding task to task list
        addTasktoTable(table, data[i]);
      }
    })
    .catch((error) => {
      console.log("Caught exception while fetching tasks for user." + error);
    });
}

function btnFetchTasksClick() {
  console.log("Entered btnFetchTasksClick...");
  let taskRowDiv = document.getElementById("taskRowDiv");
  clearDiv(taskRowDiv);

  fetch(`${serverLocation}/api/todos`)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        taskRowDiv.appendChild(createCard(data[i]));
      }
    })
    .catch((error) => {
      console.log("Caught exception while fetching tasks");
    });
}

function clearTable(table) {}

function addTasktoTable(table, task) {
  let row = table.insertRow(-1);

  let descCell = row.insertCell(0);
  let statusCell = row.insertCell(1);
  let detailsCell = row.insertCell(2);
  let deleteCell = row.insertCell(3);
  //let editCell = row.insertCell(4);
  let reassignCell = row.insertCell(4);

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
                      <i class="fa fa-list"></i>
                      </a>`;

  let delanchor = document.createElement("a");
  delanchor.href = `javascript:deleteTask(${task.id})`;
  //delanchor.text = "Delete";
  delanchor.innerHTML = `<i class="fa fa-trash"></i>`;
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

  const shadowDiv = document.createElement("div");
  shadowDiv.classList.add("card-big-shadow");

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  cardDiv.classList.add("card-just-text");
  cardDiv.setAttribute("data-background", "color");
  cardDiv.setAttribute("data-color", "green");
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

  const deadlineElement = document.createElement("p");
  deadlineElement.textContent = "Due by " + task.deadline;
  deadlineElement.classList.add("category");
  deadlineElement.classList.add("mb-4");

  const priorityElement = document.createElement("p");
  priorityElement.textContent = "Priority: " + task.priority;
  priorityElement.classList.add("category");
  priorityElement.classList.add("mb-4");

  contentDiv.appendChild(categoryElement);
  contentDiv.appendChild(descElement);
  contentDiv.appendChild(deadlineElement);
  contentDiv.appendChild(priorityElement);

  if (task.completed) {
    const doneElement = document.createElement("p");
    //doneElement.textContent = task.completed;
    doneElement.innerHTML = `<i class="fa-regular fa-circle-check"></i>`;
    //doneElement.innerHTML = ` <span class="fa fa-shopping-cart" style="font-size:30px;color:rgb(41, 156, 64)"></span>`;
    //doneElement.innerHTML = ` <span class="fa-regular fa-circle-check" style="font-size:30px;color:rgb(41, 156, 64)"></span>`;

    doneElement.classList.add("category");
    doneElement.classList.add("mb-4");

    contentDiv.appendChild(doneElement);
  }
  //https://fontawesome.com/icons/circle-check?f=classic&s=regular

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

  const categoriesForNewTask = document.getElementById("categoriesForNewTask");
  initFormCategoriesDropdown();
}

function initFormCategoriesDropdown() {
  console.log("Entered initFormCategoriesDropdown...");
  const categoriesDropdown = document.getElementById("categoriesForNewTask");

  fetch(`${serverLocation}/api/categories`)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        let theOption = new Option(data[i].name, data[i].id);
        categoriesDropdown.appendChild(theOption);
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
      // If the POST finishes successfully, display a message
      // with the newly assigned id
      // let message = "Student " + json.id + " added";
      // let confirmationMessage =
      //   document.getElementById(confirmationMessage);
      // confirmationMessage.innerHTML = message;
      console.log("created new task successfully with id :" + json.id);
      //alert("created new task successfully with id :" + json.id);
    })
    .catch((err) => {
      // If the POST returns an error, display a message
      let confirmationMessage = document.getElementById(confirmationMessage);
      confirmationMessage.innerHTML = "Unexpected error";

      console.log("Caught unexpected error while created new task:" + err);
    });

  // alert("user id: " + document.getElementById("usersListForNewTask").value);
  // alert("category: " + document.getElementById("categoriesForNewTask").value);
  // alert("description: " + document.getElementById("descriptionForNewTask").value);
  // alert("deadline: " + document.getElementById("deadlineForNewTask").value);
  // alert("priority: " + document.getElementById("priorityForNewTask").value);
}

//Right now PUT for task supports only change in complete status
//So cannot reassignUser nor update any task field othere than 'complete' field

function updateTaskStatus(event, taskid) {
  taskstatus = event.target.value;

  console.log(
    `Going to update task with id ${taskid} to status completed as ${taskstatus}`
  );

  //update task status

  let updateTaskObj = {
    id: taskid,
    completed: taskstatus,
  };

  //alert(" Task to update: " + JSON.stringify(updateTaskObj));

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
      } else throw error("Could not update task status");
    })
    .catch((err) => {
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

  var modalDeadline = document.getElementById("modaltaskdeadline");
  modalDeadline.innerText = deadline;

  var modalPriority = document.getElementById("modaltaskpriority");
  modalPriority.innerText = priority;
});
