sa = new SheetsApi();
sa.handleClientLoad();
var old_student_id = window.localStorage.getItem("studentID");

function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    fillStudentInfo();
  } else {
    console.log("Need Log In!");
    sa.handleSignInClick();
  }
}

function fillStudentInfo() {
  // Get headers.

  // Get input types/vocabularies and generate HTML for inputs.
}

function submit() {

}
