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
// Initialize the S3 client
var s3 = new AWS.S3({
  accessKeyId: 'AKIA36SH4LVGGSTZU5MF',
  secretAccessKey: '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',
  region: 'ap-northeast-2'
});

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

  // Generate a unique key for the uploaded file
  var filename = Date.now() + '-' + picture.name;

  // Prepare the parameters for the S3 upload
  var params = {
    Bucket: 'facerecsejong',
    Key: filename,
    Body: picture,
  };

  console.log("About to upload")
  // Perform the S3 upload
  s3.upload(params, function(err, data) {
    if (err) {
      console.log('Error uploading file:', err);
    } else {
      console.log('File uploaded successfully:', data.Location);

      // Create a student object with the entered data and the S3 file URL
      var student = {
        picture: data.Location,
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
    }
  });
}

// Attach event listener to the form submit event
var form = document.getElementById("upload-form");
form.addEventListener("submit", handleFormSubmit);

// Display the initial student list
displayStudentList();
