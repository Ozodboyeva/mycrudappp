const filterGroupSelect = document.querySelector("#group-filter");
const groupSelect = document.querySelector("#group");
const studentForm = document.querySelector(".student-form");
const studentModal = document.querySelector("#student-modal");
const studentTableBody = document.querySelector(".student-table tbody");
const modalOpenBtn = document.querySelector(".modal-open-btn");
const modalSubmitBtn = document.querySelector(".modal-submit-btn");
const studentSearchInput = document.querySelector(".student-search-input");
const firstNameSortSelect = document.querySelector("#firstName-sort");

let studentsJson = localStorage.getItem("students");

let students = JSON.parse(studentsJson) || [];
let selected = null;
let search = "";
let group = "All";
let sort = "Clear";

filterGroupSelect.innerHTML = `<option>All</option>`;

groups.map((gr) => {
  filterGroupSelect.innerHTML += `<option>${gr}</option>`;
  groupSelect.innerHTML += `<option>${gr}</option>`;
});

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  this.classList.add("was-validated");
  if (this.checkValidity()) {
    let { firstName, lastName, group, isMerried } = this.elements;
    let student = {
      firstName: firstName.value,
      lastName: lastName.value,
      group: group.value,
      isMerried: isMerried.checked,
    };

    if (selected === null) {
      students.push(student);
    } else {
      students[selected] = student;
    }

    localStorage.setItem("students", JSON.stringify(students));
    bootstrap.Modal.getInstance(studentModal).hide();

    this.classList.remove("was-validated");

    getStudents();
  }
});

function getStudentRow({ firstName, lastName, group, isMerried }, i) {
  return `
    <tr>
      <th scope="row">${i + 1}</th>
      <td>${firstName}</td>
      <td>${lastName}</td>
      <td>${group}</td>
      <td>${isMerried ? "Yes" : "No"}</td>
      <td class="text-end">
        <button onclick="editStudent(${i})" data-bs-toggle="modal" data-bs-target="#student-modal" class="me-3 btn btn-primary">Edit</button>
        <button onclick="deleteStudent(${i})" class="btn btn-danger">Delete</button>
      </td>
    </tr>
  `;
}

function getStudents() {
  let results = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(search) ||
      student.lastName.toLowerCase().includes(search)
  );

  if (group !== "All") {
    results = results.filter((student) => student.group === group);
  }

  if (sort !== "Clear") {
    results.sort((a, b) => {
      let nameA;
      let nameB;
      if (sort === "A-Z") {
        nameA = a.firstName.toLowerCase();
        nameB = b.firstName.toLowerCase();
      } else {
        nameB = a.firstName.toLowerCase();
        nameA = b.firstName.toLowerCase();
      }

      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  if (results.length !== 0) {
    studentTableBody.innerHTML = "";
    results.map((student, i) => {
      studentTableBody.innerHTML += getStudentRow(student, i);
    });
  } else {
    studentTableBody.innerHTML = `<td colspan="6">
      <div class="alert alert-warning">No students</div>
    </td>`;
  }
}

getStudents();

function deleteStudent(i) {
  let deleteConfirm = confirm("Are you sure you want to delete this student?");
  if (deleteConfirm) {
    students.splice(i, 1);
    localStorage.setItem("students", JSON.stringify(students));
    getStudents();
  }
}

function editStudent(i) {
  selected = i;
  modalSubmitBtn.textContent = "Save student";

  let { firstName, lastName, group, isMerried } = students[i];

  studentForm.firstName.value = firstName;
  studentForm.lastName.value = lastName;
  studentForm.group.value = group;
  studentForm.isMerried.checked = isMerried;
}

modalOpenBtn.addEventListener("click", () => {
  selected = null;
  modalSubmitBtn.textContent = "Add student";

  let { firstName, lastName, group, isMerried } = studentForm.elements;

  firstName.value = "";
  lastName.value = "";
  group.value = groups[0];
  isMerried.checked = false;
});

studentSearchInput.addEventListener("keyup", function () {
  search = this.value.trim().toLowerCase();
  getStudents();
});

filterGroupSelect.addEventListener("change", function () {
  group = this.value;
  getStudents();
});

firstNameSortSelect.addEventListener("change", function () {
  sort = this.value;
  getStudents();
});
