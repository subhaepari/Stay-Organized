# ToDo Keeper

Stay organized, tracked and focussed with this handy application where you could monitor and manage tasks for multiple users on a regular basis.
It is a completely responsive application, adapting to different screen sizes.

Technology Stack:

  Front-end: HTML5, CSS, BootStrap, JavaScript
  
  Back-end: Rest API with NodeJS Express framework. (On a different project)

## Landing page

The landing page from where a user can sign-up and sign-in to the application. 

### Landing page - On Small screen

<img width="612" alt="Landing Page - Small Screen" src="https://github.com/user-attachments/assets/c59c89b7-9779-413f-9985-dad69257a44b">

### Landing page - On Large screen

<img width="1512" alt="Landing Page" src="https://github.com/user-attachments/assets/d16dd9c2-b0ae-46cd-bf90-6a1c575efd94">


### Landing page - Sign Up Offcanvas form

The sign-in and sign-up pages are implemented as offcanvas forms. 
All the user inputs are validated and error messages shown upfront before form submission. 
Validations like username availability, password criteria, passwords matching are taken care.

<img width="1512" alt="Sign Up" src="https://github.com/user-attachments/assets/5e1807fc-44e8-4b54-b7e9-90eab9d05385">


## Task List View

On successful sign-in user lands on his/her dashboard to view and manage own tasks by default. 
You could even view and manage tasks of any other user registered in the application just by re-selecting the user from the users dropdown.

You could filter tasks based on assigned user, task category, task priority.
A progress bar indicates the percentage completion of the filtered or displayed tasks.

All the CRUD operations for a task could be performed from here.
Status of any task could be toggled between complete and incomplete.
A task could be re-assigned to any other user.
A task could be deleted if not required to be tracked anymore.

### Task List View - On Small screen

<img width="612" alt="Small Screen" src="https://github.com/user-attachments/assets/1d4f476b-5330-4f4c-a3ac-c12a50a0f48d">

### Task List View - On Large screen

<img width="1512" alt="User Tasks - List View" src="https://github.com/user-attachments/assets/7949dd04-da27-459b-976b-aba69d911ad1">

### Task List View - Task Status toggle successful message

<img width="1512" alt="Status Toggle  Message" src="https://github.com/user-attachments/assets/9bc407d3-dac9-42fa-a0f8-514888cebcf9">

### Task List View - Task Detail pop-up

On clicking the detail icon for a task in the list, a pop-up appears with a sticky note view.

<img width="1512" alt="Detail Pop-Up" src="https://github.com/user-attachments/assets/19ea4aa7-2803-4e39-82d1-d5e3d9415f6b">



## Task Board View

Hover and click on the first button from the top left corner to Toggle the Layout. If on the list view it will switch to a board view displaying tasks as an array of sticky notes.
From here any task status could be toggled.


## Add Task

From the top left page corner hover and click on the second button saying 'Add Task'. An offcanvas form appears to create a new task.

<img width="1512" alt="Users Tasks - Board View" src="https://github.com/user-attachments/assets/9bae87a1-b990-4cfa-8c2e-03b7e0013d8c">

<img width="1512" alt="Add New Task" src="https://github.com/user-attachments/assets/11703f7b-93cb-404f-92d9-bba61353a4ee">

A task could be assigned to a user on creation and could also be re-assigned to any other user later.
A task could belong to any pre-defined category - Personal, Financial, Work, Errand, etc.
A crisp and meaningful description for the task can be given.
A task could be assigned a priority - High, Medium, Low
A task could be assigned a due date.








