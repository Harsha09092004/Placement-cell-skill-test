// Initialize notifications and students from localStorage
let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
let students = JSON.parse(localStorage.getItem('students')) || [];

// Show Portal Selection Screen
function showPortal() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('portalScreen').style.display = 'block';
}

// Show Login Screen for Selected Portal
function showLogin(portal) {
    document.getElementById('portalScreen').style.display = 'none';
    if (portal === 'student') {
        document.getElementById('studentLogin').style.display = 'block';
    } else if (portal === 'admin') {
        document.getElementById('adminLogin').style.display = 'block';
    }
}

// Student Login Logic
function studentLogin() {
    const username = document.getElementById('studentUsername').value;
    const password = document.getElementById('studentPassword').value;
    if (username && password) {
        alert("Student Logged In Successfully");
        document.getElementById('studentLogin').style.display = 'none';
        document.getElementById('studentPanel').style.display = 'block';

        // Show unread notifications
        showUnreadNotifications();
    } else {
        alert("Please enter valid credentials");
    }
}

// Admin Login Logic
function adminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const defaultUsername = 'Rit54321';
    const defaultPassword = '9876543210';

    if (username === defaultUsername && password === defaultPassword) {
        alert("Admin Logged In Successfully");
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
    } else {
        alert("Invalid credentials, please try again.");
    }
}

// Function to manage notifications
function manageNotifications() {
    let notificationForm = `
        <div class="form-container">
            <h3>Add Company Interview Notification</h3>
            <label for="companyName">Company Name:</label>
            <input type="text" id="companyName" placeholder="Enter Company Name">
            <label for="interviewDate">Interview Date:</label>
            <input type="date" id="interviewDate">
            <label for="companyWebsite">Company Website:</label>
            <input type="url" id="companyWebsite" placeholder="Enter Company Website">
            <button onclick="submitNotification()">Add Notification</button>
        </div>
        <br>
        <div id="notificationListContainer">
            ${generateNotificationList()}
        </div>
    `;
    document.getElementById('adminPanel').innerHTML = notificationForm;
}

// Function to submit notification
function submitNotification() {
    const companyName = document.getElementById('companyName').value;
    const interviewDate = document.getElementById('interviewDate').value;
    const companyWebsite = document.getElementById('companyWebsite').value;

    if (companyName && interviewDate && companyWebsite) {
        const newNotification = {
            companyName,
            interviewDate,
            companyWebsite
        };
        notifications.push(newNotification);
        localStorage.setItem('notifications', JSON.stringify(notifications)); // Save to local storage
        alert("Notification added successfully!");
        showNotificationPopup(newNotification); // Show popup for the new notification
        document.getElementById('notificationListContainer').innerHTML = generateNotificationList();
    } else {
        alert("Please fill in all fields.");
    }
}

// Function to show notification popup
function showNotificationPopup(notification) {
    alert(`New Notification: ${notification.companyName} - Interview on ${notification.interviewDate}. More details at: ${notification.companyWebsite}`);
}

// Function to generate notification list
function generateNotificationList() {
    if (notifications.length === 0) {
        return "<p>No notifications added yet.</p>";
    }

    let notificationList = '<h4>Notifications</h4><ul>';
    notifications.forEach((n, index) => {
        notificationList += `
            <li>
                ${n.companyName} - Interview on ${n.interviewDate} 
                <a href="${n.companyWebsite}" target="_blank">More Details</a>
                <button onclick="deleteNotification(${index})">Delete</button>
            </li>`;
    });
    notificationList += '</ul>';
    return notificationList;
}

// Function to delete notification
function deleteNotification(index) {
    notifications.splice(index, 1);
    localStorage.setItem('notifications', JSON.stringify(notifications)); // Save to local storage
    alert("Notification deleted successfully!");
    document.getElementById('notificationListContainer').innerHTML = generateNotificationList();
}

// Function to submit and save the new student
function submitStudent() {
    const studentRegNo = document.getElementById('studentRegNo').value;
    const studentContact = document.getElementById('studentContact').value;

    if (studentRegNo && studentContact) {
        const newStudent = {
            regNo: studentRegNo,
            contact: studentContact
        };
        students.push(newStudent);
        localStorage.setItem('students', JSON.stringify(students)); // Save to local storage
        alert("Student added successfully!");

        // Clear the input fields
        document.getElementById('studentRegNo').value = '';
        document.getElementById('studentContact').value = '';

        // Update the student list after adding
        document.getElementById('studentListContainer').innerHTML = generateStudentList();
    } else {
        alert("Please fill in all fields.");
    }
}

// Function to generate the list of students
function generateStudentList() {
    if (students.length === 0) {
        return "<p>No students added yet.</p>";
    }

    let studentList = '<h4>Student List</h4><ul>';
    students.forEach((student, index) => {
        studentList += `
            <li>
                <span>Reg No: ${student.regNo}, Contact: ${student.contact}</span>
                <button onclick="deleteStudent(${index})">Delete</button>
            </li>`;
    });
    studentList += '</ul>';
    return studentList;
}

// Function to delete a student
function deleteStudent(index) {
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students)); // Save to local storage
    alert("Student deleted successfully!");

    // Update the student list after deletion
    document.getElementById('studentListContainer').innerHTML = generateStudentList();
}

// Button in Admin Panel to trigger Manage Students view
function goBackToAdmin() {
    document.getElementById('studentManagement').style.display = 'none'; // Hide student management
    document.getElementById('adminPanel').innerHTML = `
        <h2>Admin Panel</h2>
        <button onclick="manageNotifications()">Manage Interview Notifications</button>
        <button onclick="manageSkillTest()">Manage Skill Test</button>
        <button onclick="manageStudents()">Manage Students</button>
        <button onclick="logout()">Logout</button>
    `;
}

// Show unread notifications as popups for students
function showUnreadNotifications() {
    notifications.forEach(notification => {
        showNotificationPopup(notification);
    });
}

// Start Skill Test
function startSkillTest() {
    // Assuming skill questions are loaded in skillQuestions array
    initializeSkillTest();
}

// Initialize the skill test (example function)
function initializeSkillTest() {
    // Your skill test initialization code here
}

// Logout function
function logout() {
    document.getElementById('studentPanel').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('portalScreen').style.display = 'block';
}


// Skill Test Functionality
let skillQuestions = JSON.parse(localStorage.getItem('skillQuestions')) || [];
let selectedQuestions = [];
let currentQuestionIndex = 0;
let timer;
let totalTestTime = 15 * 60; // 15 minutes in seconds

// Start the skill test
function startSkillTest() {
    if (skillQuestions.length < 20) {
        alert("Not enough questions available for the test.");
        return;
    }

    selectedQuestions = [];
    totalTestTime = 15 * 60; // Reset time to 15 minutes

    // Randomly select 20 questions from the skillQuestions array
    while (selectedQuestions.length < 20) {
        let randomIndex = Math.floor(Math.random() * skillQuestions.length);
        if (!selectedQuestions.includes(skillQuestions[randomIndex])) {
            selectedQuestions.push(skillQuestions[randomIndex]);
        }
    }

    currentQuestionIndex = 0;
    document.getElementById('skillTestPanel').innerHTML = renderQuestion();
    startTimer();
}

// Render the skill test question
function renderQuestion() {
    if (currentQuestionIndex >= selectedQuestions.length) {
        return `<p>Test Completed. Please click Final Submit to finish the test.</p><button onclick="finalSubmit()">Final Submit</button>`;
    }

    const currentQuestion = selectedQuestions[currentQuestionIndex];
    return `
        <h4>Question ${currentQuestionIndex + 1}: ${currentQuestion.question}</h4>
        <ul>
            <li><input type="radio" name="answer" value="1"> ${currentQuestion.options[0]}</li>
            <li><input type="radio" name="answer" value="2"> ${currentQuestion.options[1]}</li>
            <li><input type="radio" name="answer" value="3"> ${currentQuestion.options[2]}</li>
            <li><input type="radio" name="answer" value="4"> ${currentQuestion.options[3]}</li>
        </ul>
        <button onclick="submitQuestion()">Submit Answer</button>
    `;
}

// Submit the current question and move to the next one
function submitQuestion() {
    currentQuestionIndex++;
    document.getElementById('skillTestPanel').innerHTML = renderQuestion();
}

// Timer function for the skill test
function startTimer() {
    timer = setInterval(function () {
        totalTestTime--;

        const minutes = Math.floor(totalTestTime / 60);
        const seconds = totalTestTime % 60;

        let timeDisplay = document.getElementById('skillTestPanel').querySelector('p');
        if (timeDisplay) {
            timeDisplay.innerHTML = `Time Remaining: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        } else {
            document.getElementById('skillTestPanel').innerHTML += `<p>Time Remaining: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}</p>`;
        }

        if (totalTestTime <= 0) {
            clearInterval(timer);
            alert("Time is up!");
            finalSubmit();
        }
    }, 1000);
}

// Final submit function after completing the test
function finalSubmit() {
    clearInterval(timer);
    alert("Test Submitted Successfully!");
    document.getElementById('skillTestPanel').innerHTML = '<p>Thank you for completing the test.</p>';
}

// Generate the skill test list
function generateSkillTestList() {
    if (skillQuestions.length === 0) {
        return "<p>No skill test questions added yet.</p>";
    }

    let questionList = '<h4>Skill Test Questions</h4><ul>';
    skillQuestions.forEach((q, index) => {
        questionList += `
            <li>${q.question} 
            <button onclick="deleteSkillTestQuestion(${index})">Delete</button>
            </li>`;
    });
    questionList += '</ul>';
    return questionList;
}

// Delete skill test question
function deleteSkillTestQuestion(index) {
    skillQuestions.splice(index, 1);
    localStorage.setItem('skillQuestions', JSON.stringify(skillQuestions)); // Save to local storage
    alert("Question deleted successfully!");
    document.getElementById('skillTestListContainer').innerHTML = generateSkillTestList();
}

// Manage Skill Test
function manageSkillTest() {
    let skillTestForm = `
        <div class="form-container">
            <h3>Add Skill Test Question</h3>
            <label for="question">Question:</label>
            <input type="text" id="question" placeholder="Enter Question">
            <label for="option1">Option 1:</label>
            <input type="text" id="option1" placeholder="Enter Option 1">
            <label for="option2">Option 2:</label>
            <input type="text" id="option2" placeholder="Enter Option 2">
            <label for="option3">Option 3:</label>
            <input type="text" id="option3" placeholder="Enter Option 3">
            <label for="option4">Option 4:</label>
            <input type="text" id="option4" placeholder="Enter Option 4">
            <label for="correctOption">Correct Option (1-4):</label>
            <input type="number" id="correctOption" min="1" max="4">
            <button onclick="submitSkillTestQuestion()">Add Question</button>
        </div>
        <br>
        <div id="skillTestListContainer">
            ${generateSkillTestList()}
        </div>
    `;
    document.getElementById('adminPanel').innerHTML = skillTestForm;
}

// Submit skill test question
function submitSkillTestQuestion() {
    const question = document.getElementById('question').value;
    const option1 = document.getElementById('option1').value;
    const option2 = document.getElementById('option2').value;
    const option3 = document.getElementById('option3').value;
    const option4 = document.getElementById('option4').value;
    const correctOption = document.getElementById('correctOption').value;

    if (question && option1 && option2 && option3 && option4 && correctOption) {
        const newQuestion = {
            question,
            options: [option1, option2, option3, option4],
            correctOption
        };
        skillQuestions.push(newQuestion);
        localStorage.setItem('skillQuestions', JSON.stringify(skillQuestions)); // Save to local storage
        alert("Question added successfully!");
        manageSkillTest();
    } else {
        alert("Please fill out all fields.");
    }
}

// Logout function
function logout() {
    document.getElementById('studentPanel').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('portalScreen').style.display = 'block';
}

// Function to go back to the admin dashboard
function goBackToAdmin() {
    document.getElementById('studentManagement').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
}



// Manage Students
function manageStudents() {
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('studentManagement').style.display = 'block';
    document.getElementById('studentListContainer').innerHTML = generateStudentList();
}

// Function to submit and save the new student
function submitStudent() {
    const studentRegNo = document.getElementById('studentRegNo').value;
    const studentContact = document.getElementById('studentContact').value;

    if (studentRegNo && studentContact) {
        const newStudent = {
            regNo: studentRegNo,
            contact: studentContact
        };
        students.push(newStudent);
        localStorage.setItem('students', JSON.stringify(students)); // Save to local storage
        alert("Student added successfully!");

        // Clear the input fields
        document.getElementById('studentRegNo').value = '';
        document.getElementById('studentContact').value = '';

        // Update the student list after adding
        document.getElementById('studentListContainer').innerHTML = generateStudentList();
    } else {
        alert("Please fill in all fields.");
    }
}

// Function to generate the list of students
function generateStudentList() {
    if (students.length === 0) {
        return "<p>No students added yet.</p>";
    }

    let studentList = '<h4>Student List</h4><ul>';
    students.forEach((student, index) => {
        studentList += `
            <li>
                <span>Reg No: ${student.regNo}, Contact: ${student.contact}</span>
                <button onclick="deleteStudent(${index})">Delete</button>
            </li>`;
    });
    studentList += '</ul>';
    return studentList;
}

// Function to delete a student
function deleteStudent(index) {
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students)); // Save to local storage
    alert("Student deleted successfully!");

    // Update the student list after deletion
    document.getElementById('studentListContainer').innerHTML = generateStudentList();
}

// Go back to Admin Panel
function goBackToAdmin() {
    document.getElementById('studentManagement').style.display = 'none'; // Hide student management
    document.getElementById('adminPanel').style.display = 'block'; // Show admin panel
}