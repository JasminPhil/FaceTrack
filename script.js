// Sample student data
var students = [];

// Function to display the student list
function displayStudentList() {
  var studentList = document.getElementById("student-list");

  // Clear existing list
  studentList.innerHTML = "";

  // Create and append list items for each student
  students.forEach(function (student, index) {
    var listItem = document.createElement("li");
    listItem.classList.add("student-item");

    var pictureImg = document.createElement("img");
    pictureImg.src = student.picture;
    pictureImg.alt = student.name;
    pictureImg.classList.add("student-picture");
    pictureImg.addEventListener("click", function () {
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

    var removeButton = document.createElement("button");
    removeButton.innerText = "Remove";
    removeButton.classList.add("remove-button");
    removeButton.addEventListener("click", function () {
      removeStudent(index);
    });
    listItem.appendChild(removeButton);

    studentList.appendChild(listItem);
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
  reader.onload = function (e) {
    var pictureDataURL = e.target.result;

    // Create a student object with the entered data
    var student = {
      picture: pictureDataURL,
      name: name,
      number: studentNumber,
    };

    // Add the student to the students array
    students.push(student);

    // Clear form inputs
    pictureInput.value = "";
    nameInput.value = "";
    studentNumberInput.value = "";

    // Display updated student list
    displayStudentList();

    // Update students in localStorage
    localStorage.setItem("students", JSON.stringify(students));
  };

  // Read the uploaded picture as a data URL
  reader.readAsDataURL(picture);
}

// Function to remove a student
function removeStudent(index) {
  students.splice(index, 1); // Remove student from array

  // Display updated student list
  displayStudentList();

  // Update students in localStorage
  localStorage.setItem("students", JSON.stringify(students));
}

// Retrieve students from localStorage on page load
function retrieveStudentsFromLocalStorage() {
  var storedStudents = localStorage.getItem("students");

  if (storedStudents) {
    students = JSON.parse(storedStudents);
  }
}

// Attach event listener to the window load event
window.addEventListener("load", function () {
  retrieveStudentsFromLocalStorage();
  displayStudentList();
});

// Attach event listener to the form submit event
var form = document.getElementById("upload-form");
form.addEventListener("submit", handleFormSubmit);
