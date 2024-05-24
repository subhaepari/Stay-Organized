(function () {
    'use strict'
  
    var forms = document.querySelectorAll('.needs-validation')
  
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          if(form.id == 'addNewUserForm'){

           if(!validatePassword()){
            event.preventDefault();
            event.stopPropagation();

            let password = document.getElementById("psw");
            let confirm_password = document.getElementById("confirmpsw");
            
            password.onkeyup = validatePassword;
            confirm_password.onkeyup = validatePassword;

           }
       
          }
 
          form.classList.add('was-validated')
        }, false)
      })
  })()
  
  function validatePassword(){
    let password = document.getElementById("psw");
    let confirm_password = document.getElementById("confirmpsw");
     // alert("Matching passwords " + password.value + "  " + confirm_password.value);
    let errorMessage = document.getElementById("add-user-error-message");
    if(password.value != confirm_password.value) { 
      errorMessage.innerHTML = "Passwords not matching.";
      return false;
    } 
    else{
      errorMessage.innerHTML = "";
      return true;
    }
  }