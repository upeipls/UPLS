sa = new SheetsApi();
sa.handleClientLoad();
function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    fillStudentInfo();
  } else {
    console.log("Need Log In!");
    sa.handleSignInClick();
  }
}

function fillStudentInfo() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var id = url.searchParams.get("id");
  // Get name and email.
  var col_names = ["FIRST_NAME", "LAST_NAME", "EMAIL"];
  var condition = [{
    "header": "STUDENT_ID", "value": id
  }];
  var sheetName = "UPLS";
  sa.getSheet(sheetName).then(response => {
    var student_info = sa.selectFromTableWhereConditions(response, col_names, condition, 0);
    var student_name = student_info[0].FIRST_NAME + " " + student_info[0].LAST_NAME;
    var email = student_info[0].EMAIL;
    console.log(student_info);
    document.getElementById("student_name").value = student_name;
    document.getElementById("student_id").value = id;
    document.getElementById("student_email").value = email;
  }, reason => {
    let msg = sa.parseErrorMessage(reason);
    console.log(msg);
  });
}

function interactionSubmit() {
	
}

function interactionCancel() {
	
}
