// JavaScript code for interacting with the UI

// Sample student data
var students = [];

// Function to display the student list
function displayStudentList() {
  var studentList = document.getElementById("student-list");

  // Clear existing list
  studentList.innerHTML = "";

  // Create and append list items for each student
  students.forEach(function(student) {
    var listItem = document.createElement("li");
    listItem.classList.add("student-item");

    var pictureImg = document.createElement("img");
    pictureImg.src = student.picture;
    pictureImg.alt = student.name;
    pictureImg.classList.add("student-picture");
    pictureImg.addEventListener("click", function() {
      enlargePicture(this);
    });
    listItem.appendChild(pictureImg);

    var studentInfo = document.createElement("div");
    studentInfo.classList.add("student-info");

    var studentName = document.createElement("span");
    studentName.innerText = student.name;
    studentInfo.appendChild(studentName);

    var studentNumber = document.createElement("span");
    studentNumber.innerText = "StudentID: " + student.number;
    studentInfo.appendChild(studentNumber);

    listItem.appendChild(studentInfo);

    studentList.appendChild(listItem);

    //check in and out 
const cont = document.createElement("div");

// Add a class to the div
cont.className = "my-class";

// Create a <span> element
const span = document.createElement("span");
span.textContent = "Abcent";
span.style.color = 'red'
// Create an <img> element
const image = document.createElement("img");
image.src = "cancel.svg";
image.className = 'check_mark'
// Append the span and image elements to the div
cont.appendChild(image);
cont.appendChild(span);

listItem.appendChild(cont);

  //   function displayTime(){
  //     // Create a new Date object
  //     const currentDate = new Date();

  //     // Get the current date
  //     var date = currentDate.toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "numeric",
  //       day: "numeric"
  //     });

  //     // Get the current time
  //     var time = currentDate.toLocaleTimeString("en-US", {
  //       hour: "numeric",
  //       minute: "numeric"
  //     });
  //     return `${date} ${time}`
  //   }
  // const time = document.createElement("span")
  // time.textContent = displayTime()
  // studentInfo.appendChild(time);
  });
}

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  // Get form inputs
  var pictureInput = document.getElementById("picture-input");
  var nameInput = document.getElementById("name-input");
  var studentNumberInput = document.getElementById("student-number-input");

  // Get the values entered by the user
  var picture = pictureInput.files[0];
  var name = nameInput.value;
  var studentNumber = studentNumberInput.value;

  // Create a FileReader object to read the uploaded picture
  var reader = new FileReader();
  reader.onload = function(e) {
    var pictureDataURL = e.target.result;

    // Create a student object with the entered data
    var student = {
      picture: pictureDataURL,
      name: name,
      number: studentNumber
    };

    // Add the student to the students array
    students.push(student);

    // Clear form inputs
    pictureInput.value = "";
    nameInput.value = "";
    studentNumberInput.value = "";

    // Display updated student list
    displayStudentList();
  };

  // Read the uploaded picture as a data URL
  reader.readAsDataURL(picture);
}

// Attach event listener to the form submit event
var form = document.getElementById("upload-form");
form.addEventListener("submit", handleFormSubmit);

// Display the initial student list
displayStudentList();
