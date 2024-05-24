window.onload = init();

var serverLocation;

function init() {

  serverLocation = "http://localhost:8083";
 
}




function usernameAvalabilityChk() {
  console.log("entered usernameAvalabilityChk");

  let username = document.getElementById("username").value;

  //Checking for username availability
  fetch(`${serverLocation}/api/username_available/` + username)
    .then((response) => response.json())
    .then((json) => {
      if (json.available == false) {
        console.log(`Username ${username} not available, try another`);
        let confirmationMessage = document.getElementById("add-user-avail-msg");
        confirmationMessage.innerHTML = `Username ${username} not available, try another`;
      } else {
        let confirmationMessage = document.getElementById("add-user-avail-msg");
        confirmationMessage.innerHTML = "";
      }
    })
    .catch((err) => {
      console.log(
        "Caught unexpected error while checking for user availability" + err
      );
    });
}

function addNewUser() {
  console.log("entered add new user page");

  let newUserObj = {
    name: document.getElementById("name").value,
    username: document.getElementById("username").value,
    password: document.getElementById("psw").value,
  };

  //alert("New user to create: " + JSON.stringify(newUserObj));
  let username = document.getElementById("username").value;

  //Checking for username availability
  fetch(`${serverLocation}/api/username_available/` + username)
    .then((response) => response.json())
    .then((json) => {
      if (json.available == false) {
        console.log(`Username ${username} not available, try another`);
        // alert(`Username ${username} not available, try another`);
        throw `Username ${username} not available, try another`;
      }
    })
    .catch((err) => {
      // If the POST returns an error, display a message
      let confirmationMessage = document.getElementById(
        "add-user-error-message"
      );
      confirmationMessage.innerHTML = err;

      console.log(
        "Caught unexpected error while checking for user availability" + err
      );
      return;
    });

  fetch(`${serverLocation}/api/users`, {
    method: "POST",
    body: JSON.stringify(newUserObj),
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

      if (json.id === undefined || json.id === null) {
        console.log("user could not be added.");
        throw "User could not be added.";
      }

      console.log("created new user successfully with id :" + json.id);
      //alert("created new user successfully with id :" + json.id);

      let confirmationMessage = document.getElementById("add-user-message");
      confirmationMessage.innerHTML = "Registered User Successfully";
    })
    .catch((err) => {
      // If the POST returns an error, display a message
      let confirmationMessage = document.getElementById(
        "add-user-error-message"
      );
      confirmationMessage.innerHTML = err;

      console.log("Caught unexpected error while creating new user:" + err);
    });
}

