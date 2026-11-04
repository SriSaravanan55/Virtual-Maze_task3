/* ==========================================
       GLOBAL VARIABLES
===========================================*/

let students = getStudents();
let navButtons = document.querySelectorAll(".nav-button");
let pages = document.querySelectorAll(".page");
let studentForm = document.getElementById("student-form");
let searchButton = document.getElementById("search-button");

/* ==========================================
              LOCAL STORAGE FUNCTIONS
 ===========================================*/

function getStudents() {
    let data = localStorage.getItem("students");
    if (data === null) {
        return [];
    }
    return JSON.parse(data);
}

function saveStudents(studentData) {
    localStorage.setItem("students", JSON.stringify(studentData));
    // Update global variable
    students = studentData;
}


class Student {
    // CONSTRUCTOR
    constructor(id, name, email, age, department, marks) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.department = department;
        this.marks = marks;
    }

    // STATIC METHOD - GENERATE STUDENT ID
    static generateId(students) {
        if (students.length === 0) {
            return 1;
        }
        return Math.max(...students.map(student => student.id)) + 1;
    }

    // STATIC METHOD - CALCULATE AVERAGE
    static calculateAverage(student) {
        let marks = student.marks;
        let total = marks.tamil + marks.english + marks.maths + marks.science + marks.social;
        return total / 5;

    }

    // STATIC METHOD - CALCULATE GRADE
    static calculateGrade(student) {
        let average = Student.calculateAverage(student);
        if (average >= 90)  return "O";

        else if (average > 80 && average < 90)  return "A+";

        else if (average > 70 && average <= 80) return "A";
        
        else if (average > 60 && average <= 70) return "B+";

        else if (average > 50 && average <= 60)  return "B";

        else return "RE";
    }
}

// PAGE NAVIGATION

navButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        let pageName = button.getAttribute("data-page");
        showPage(pageName);
        if (pageName === "dashboard") {
            loadDashboard();
        }

        if (pageName === "student-list") {
            loadStudentList();
        }

    });
});


// PAGE FUNCTION

function showPage(pageName) {

    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    navButtons.forEach(function(button) {
        button.classList.remove("active");
    });

    document.getElementById(pageName).classList.add("active");
    document.querySelector(
        '.nav-button[data-page="' + pageName + '"]'
    ).classList.add("active");

}


// ==========================================
// ADD STUDENT
// ==========================================

studentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // Get latest students from local storage
    students = getStudents();

    // GET INPUT VALUES
    let studentName = document.getElementById("studentName").value.trim();
    let email = document.getElementById("email").value.trim();
    let department = document.getElementById("department").value;
    let age = Number(document.getElementById("age").value);


    // GET SUBJECT MARKS
    let tamil = Number(document.getElementById("tamil").value);
    let english = Number(document.getElementById("english").value);
    let maths = Number(document.getElementById("maths").value);
    let science = Number(document.getElementById("science").value);
    let social = Number(document.getElementById("social").value);


    // NAME VALIDATION
    let namePattern = /^[A-Za-z ]+$/;
    if (!namePattern.test(studentName)) {
        alert("Please enter a valid student name.");
        return;
    }


    // EMAIL VALIDATION
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email.");
        return;
    }


    // DEPARTMENT VALIDATION
    if (department === "") {
        alert("Please select a department.");
        return;
    }


    // AGE VALIDATION
    if (age < 18 || age > 30 || !Number.isInteger(age)) {
        alert("Age must be between 18 and 30.");
        return;
    }


    // MARK VALIDATION
    let marksArray = [tamil, english, maths, science, social];
    for (let mark of marksArray) {
        if (mark < 0 || mark > 100 || !Number.isInteger(mark)) {
            alert("Marks must be whole numbers between 0 and 100.");
            return;
        }
    }


    // GENERATE STUDENT ID USING STATIC METHOD
    let id = Student.generateId(students);

    // CREATE STUDENT OBJECT USING CLASS
    let student = new Student(
        id,
        studentName,
        email,
        age,
        department,
        {
            tamil,
            english,
            maths,
            science,
            social
        }

    );


    // ADD STUDENT TO ARRAY
    students.push(student);
    saveStudents(students);
    alert("Student added successfully!");
    studentForm.reset();

    // REFRESH DASHBOARD AND STUDENT LIST
    loadDashboard();
    loadStudentList();

    // NAVIGATE TO STUDENT LIST
    showPage("student-list");
});


// ==========================================
// CALCULATE STUDENT AVERAGE
// ==========================================

function calculateAverage(student) {
    return Student.calculateAverage(student);
}


// ==========================================
// STUDENT GRADE
// ==========================================

function Studentgrade(student) {
    return Student.calculateGrade(student);

}


// ==========================================
// DASHBOARD
// ==========================================

function loadDashboard() {
    students = getStudents();
    document.getElementById("total-students-value").textContent = students.length;
    if (students.length === 0) {

        document.getElementById("average-mark-value").textContent = "0";
        document.getElementById("highest-mark-value").textContent = "0";
        document.getElementById("lowest-mark-value").textContent = "0";
        return;
    }


    // GET ALL STUDENT AVERAGES
    let averages = students.map(function(student) {
        return calculateAverage(student);
    });

    // CALCULATE OVERALL AVERAGE
    let total = averages.reduce(function(sum, value) { return sum + value; }, 0);
    let overallAverage = total / students.length;

    // HIGHEST AND LOWEST AVERAGE
    let highest = Math.max(...averages);
    let lowest = Math.min(...averages);

    // DISPLAY DASHBOARD VALUES
    document.getElementById("average-mark-value").textContent = overallAverage.toFixed(0);
    document.getElementById("highest-mark-value").textContent = highest.toFixed(0);
    document.getElementById("lowest-mark-value").textContent = lowest.toFixed(0);

}

// LOAD STUDENT LIST

function loadStudentList() {
    students = getStudents();
    let tableBody = document.getElementById("student-table-body");
    tableBody.innerHTML = "";

    if (students.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9">No students found.</td>
            </tr> `;
        return;
    }

    students.forEach(function(student) {
        // CALCULATE AVERAGE AND GRADE
        let average = Student.calculateAverage(student);
        let grade = Student.calculateGrade(student);

        // CREATE TABLE ROW
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.age}</td>
            <td>${student.department}</td>
        
            <td>
                Tamil: ${student.marks.tamil}<br>
                English: ${student.marks.english}<br>
                Maths: ${student.marks.maths}<br>
                Science: ${student.marks.science}<br>
                Social: ${student.marks.social}
            </td>

            <td>${average.toFixed(2)}</td>
            <td>${grade}</td>
            <td>
                <button class="delete-button" onclick="deleteStudent(${student.id})">
                    Delete </button>
            </td> `;
        tableBody.appendChild(row);
    });
}

// DELETE STUDENT

function deleteStudent(id) {
    let confirmation = confirm(
        "Are you sure you want to delete this student?"
    );
    if (!confirmation) {
        return;
    }
    students = getStudents();

    // FILTER STUDENT USING ID
    students = students.filter(function(student) {
        return student.id !== id;
    });
    // UPDATE LOCAL STORAGE
    saveStudents(students);

    alert("Student deleted successfully!");
    // REFRESH DATA
    loadStudentList();
    loadDashboard();
}


// SEARCH STUDENT

searchButton.addEventListener("click", function() {

    // GET SEARCH INPUT
    let searchValue = document.getElementById("search-input").value.trim().toLowerCase();

    students = getStudents();

    let result = document.getElementById("search-result");
    result.innerHTML = "";

    // EMPTY SEARCH VALIDATION

    if (searchValue === "") {
        result.innerHTML = `
            <p class="no-result"> Please enter a student name.
            </p> `;
        return;
    }

    // SEARCH STUDENT BY NAME

    let searchStudents = students.filter(function(student) {
        return student.name.toLowerCase().includes(searchValue);

    });

    // NO STUDENT FOUND

    if (searchStudents.length === 0) {
        result.innerHTML = ` <p class="no-result"> No student found.
        </p> `;
        return;
    }

    // DISPLAY SEARCH RESULTS

    searchStudents.forEach(function(student) {

        let average = Student.calculateAverage(student);
        let grade = Student.calculateGrade(student);
        let card = document.createElement("div");
        card.className = "search-result-card";
        card.innerHTML = `

            <h3>${student.name}</h3>

            <p><strong>ID:</strong> ${student.id}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Age:</strong> ${student.age}</p>
            <p><strong>Department:</strong> ${student.department}</p>

            <p><strong>Tamil:</strong> ${student.marks.tamil}</p>
            <p><strong>English:</strong> ${student.marks.english}</p>
            <p><strong>Maths:</strong> ${student.marks.maths}</p>
            <p><strong>Science:</strong> ${student.marks.science}</p>
            <p><strong>Social:</strong> ${student.marks.social}</p>

            <p><strong>Average:</strong> ${average.toFixed(2)}</p>
            <p><strong>Grade:</strong> ${grade}</p>

        `;
        result.appendChild(card);
    });
});

// INITIAL PAGE LOAD

loadDashboard();
loadStudentList();