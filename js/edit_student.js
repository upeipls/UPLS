sa = new SheetsApi();
sa.handleClientLoad();
var old_student_id = window.localStorage.getItem("studentID");
var old_student_info = [];
var headers = [];
var studentInfo = [];
function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    fillStudentInfo();
  } else {
    console.log("Need Log In!");
    sa.handleSignInClick();
  }
}

/** This is a function that gets called by sa.handleClientLoad() and sa.handleSignInClick()
 * when the librarian variable gets set. Anything that depends on knowing the currently logged
 * in librarian should be called from within this function.
 */
function loadPage() {
  addUserInfo();
}


function fillStudentInfo() {
  // Get headers.
  sa.getSheet("UPLS").then(response => {
    headers = sa.parseTableHeaders(response);
    var old_student_info = sa.selectFromTableWhereConditions(response, "*", [{"header":"STUDENT_ID", "value":old_student_id}], 1);
    console.log("Current student info: ");
    console.log(old_student_info);
    sa.getSheet("PROGRAMS_AND_LIBRARIANS").then(res => {
      var conditions = [];
      if (!sa.isAdmin()) {
        conditions = [{header : "LIBRARIANS", value : sa.getLibrarian()}];
      }
      var programsResult = sa.selectFromTableWhereConditions(res, ["PROGRAMS"], conditions, 1);
      var programs = [];
      for (var i = 1; i < programsResult.length; i++) {
        programs[i-1] = programsResult[i][0];
      }
      var programOptions = getOptions(programs, old_student_info[1][6]);

      // Set input types/vocabularies for known core headers and generate HTML for inputs.
      // STUDENT_ID
      studentInfo[0] = inputObject(headers[0], "text", old_student_info[1][0]);
      // LAST_NAME
      studentInfo[1] = inputObject(headers[1], "text", old_student_info[1][1]);
      // FIRST_NAME
      studentInfo[2] = inputObject(headers[2], "text", old_student_info[1][2]);
      // EMAIL
      studentInfo[3] = inputObject(headers[3], "email", old_student_info[1][3]);
      // STATUS_IN_PROGRAM
      studentInfo[4] = inputObject(headers[4], "text", old_student_info[1][4]);
      // PROGRAM_CODE
      studentInfo[5] = inputObject(headers[5], "text", old_student_info[1][5]);
      // PROGRAM_DESCRIPTION
      studentInfo[6] = selectObject(headers[6], programOptions);
      // DEPARTMENT_NAME
      studentInfo[7] = inputObject(headers[7], "text", old_student_info[1][7]);
      // FACULTY_NAME
      studentInfo[8] = inputObject(headers[8], "text", old_student_info[1][8]);
      // CLASS_LEVEL
      studentInfo[9] = inputObject(headers[9], "number", old_student_info[1][9]);
      // CATALOGUE_YEAR
      studentInfo[10] = inputObject(headers[10], "text", old_student_info[1][10]);
      // PROGRAM_MAJOR_1
      studentInfo[11] = inputObject(headers[11], "text", old_student_info[1][11]);
      // LIBRARIAN (no editing)
      studentInfo[12] = {header: headers[12], value: "<input type=\"text\" id=\"" + headers[12] + "\" value=\"" + old_student_info[1][12] + "\" disabled>"};
      // FROZEN_UPLS_ACCOUNT
      studentInfo[13] = inputObject(headers[13], "checkbox", old_student_info[1][13]);
      studentInfo[13].value = "<div class=\"tooltip\">" + studentInfo[13].value +
      "<div class=\"tooltiptext\">Checking this box will remove this student's information from all searches in this system. The only way to undo this is to have your administrator go into the database and manually change this value back to empty or \"FALSE\".</div></div>";
      // GENERAL_COMMENT
      studentInfo[14] = {header:headers[14], value: "<textarea id=\"" + headers[14] + "\">" + old_student_info[1][14] + "</textarea>"};
      // DATE_ADDED_TO_SYSTEM (no editing)
      studentInfo[15] = undefined;
      // Get input types/vocabularies for added headers and generate HTML for inputs.
      sa.getDataType().then(r => {
        var dataTypes = sa.parseDataType(r, headers);
        var vocabs = sa.parseVocab(r, headers);
        for (var i = 16; i < headers.length; i++) {
          if (vocabs[i] == undefined) {
            studentInfo[i] = inputObject(headers[i], dataTypes[i], old_student_info[1][i]);
          } else {
            var optionsList = getOptions(vocabs[i],old_student_info[1][i]);
            studentInfo[i] = selectObject(headers[i], optionsList);
          }
        }
        // Display everything nicely in a table.
        for (var i = 0; i < studentInfo.length; i++) {
          if (studentInfo[i] != undefined) {
            document.getElementById("studentInfo").innerHTML += "<tr><td>" + studentInfo[i].header+ "</td><td>" + studentInfo[i].value + "</td></tr>";
          }
        }
        document.getElementById("PROGRAM_DESCRIPTION").setAttribute("onchange", "setLibrarianInput()");
      });

    });
  });
}

function setLibrarianInput() {
  sa.getSheet("PROGRAMS_AND_LIBRARIANS").then(response => {
    var selectedProgram = document.getElementById("PROGRAM_DESCRIPTION").value;
    var lib = sa.selectFromTableWhereConditions(response, ["LIBRARIANS"], [{header: "PROGRAMS", value: selectedProgram}], 1)[1][0];
    document.getElementById("LIBRARIAN").value = lib;
  });
}


/**
 * Helper method to create HTML inputs.
 *
 * @param givenHeader string
 * @param givenType string
 * @param value string
 *
 * @return Object
 */
function inputObject(givenHeader, givenType, value) {
  var endTag = (givenHeader == "STUDENT_ID") ? "disabled>" : ">";
  return {header : givenHeader, value : "<input type=\"" + givenType + "\" id=\"" + givenHeader + "\" value=\"" + value + "\"" + endTag};
}

/**
 * Helper function for selectbox inputs.
 *
 * @return Object
 */
function selectObject(givenHeader, givenOptions) {
  return {header:givenHeader, value: "<select id=\"" + givenHeader + "\">" + givenOptions + "</select>"};
}

/**
 * Helper function for options in selectbox.
 *
 * @return string
 */
function getOptions(options, selectedOption) {
  var toReturn = "";
  if (selectedOption == undefined || selectedOption == "") {
    toReturn += "<option selected disabled></option>";
  }
  for (var i = 0; i < options.length; i++) {
    toReturn += "<option " + ((options[i] == selectedOption) ? "selected>" : ">") + options[i] + "</option>";
  }
  return toReturn;

}

function submitStudent() {
  var toSubmit = {};
  for (var i = 0; i < headers.length; i++) {
    if (studentInfo[i] != undefined) {
      toSubmit[headers[i]] = document.getElementById(headers[i]).value;
    }
  }
  console.log("Student info to be submited: ");
  console.log(toSubmit);
  sa.getSheet("UPLS").then(response => {
    var sheetVals = sa.parseSheetValues(response);
    sa.rowUpdate(sheetVals, "UPLS", toSubmit, [{header:"STUDENT_ID", value:old_student_id}]).then(res => {
      console.log(res);
      var row = sa.parseUpdate(res);
      if (row == -1) {
        console.log("No rows matched the selected student id in UPLS.");
        alert("Could not update the selected student. Could not find the old row to update.");
      } else {
        console.log("Row " + row + " has been updated in the UPLS sheet.");
        alert("Student information has been updated.");
      }
      window.location.href = "main_page.html";
    }, reas => {
      let m = sa.parseErrorMessage(reas);
      console.log(m);
    });
  }, reason => {
    let msg = sa.parseErrorMessage(reason);
    console.log(msg);
  });
}
