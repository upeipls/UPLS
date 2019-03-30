sa = new SheetsApi();
sa.handleClientLoad();
var old_student_id = window.localStorage.getItem("studentID");
var old_interaction = JSON.parse(window.localStorage.getItem("interactionInfo"));
var old_interaction_type = old_interaction[0];
var old_date = old_interaction[1];
var old_lib_init = old_interaction[2];
var old_follow_up = old_interaction[3];
var old_time = old_interaction[4];
var old_comm_chan = old_interaction[5];
var old_url = old_interaction[6];
var old_note = old_interaction[7];

function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    fillStudentInfo();
  } else {
    console.log("Need Log In!");
    sa.handleSignInClick();
  }
}

/**
 * This functions gets all necessary information from the database to setup the
 * form.
 */
function fillStudentInfo() {
  // Get list of student IDs.
  sa.getSheet("UPLS").then(response => {
    var student_ids = sa.selectFromTableWhereConditions(response, ["STUDENT_ID"], [], 1);
    for (let i = 1; i < student_ids.length; i++) {
      if (old_student_id == student_ids[i]) {
        var id_option = "<option selected>" + old_student_id + "</option>";
      } else {
        var id_option = "<option>" + student_ids[i] + "</option>";
      }
      document.getElementById("student_id").innerHTML += id_option;
    }
  });
  // Get list of interaction types.
  var interactions_table = "INTERACTIONS";
  var interactions_condition = [{
    "header": "INTERACTIONS_LIST", "value": ""
  }];
  sa.getSheet(interactions_table).then(response => {
    var interaction_types = sa.selectFromTableWhereConditions(response, ["INTERACTIONS_LIST"], interactions_condition, 1);
    for (let i = 1; i < interaction_types.length; i++) {
      var interaction_type = interaction_types[i];
      if (interaction_type != "" && interaction_type != "undefined") {
        if (old_interaction_type == interaction_type) {
          var interaction_type_option = "<option selected>" + interaction_type + "</option>";
        } else {
          var interaction_type_option = "<option>" + interaction_type + "</option>";
        }
        document.getElementById("interaction_type").innerHTML += interaction_type_option;
      }
    }
  }, reason => {
    let msg = sa.parseErrorMessage(reason);
    console.log(msg);
  });
  // Get list of communication channels.
  var communication_condition = [];
  sa.getSheet(interactions_table).then(response => {
    var communication_channels = sa.selectFromTableWhereConditions(response, ["COMMUNICATION_CHANNEL"], communication_condition, 1);
    for (let i = 1; i < communication_channels.length; i++) {
      var communication_channel = communication_channels[i];
      if (communication_channel != "" && communication_channel != "undefined") {
        if (old_comm_chan == communication_channel) {
          var communication_channel_option = "<option selected>" + communication_channel + "</option>";
        } else {
          var communication_channel_option = "<option>" + communication_channel + "</option>";
        }
        document.getElementById("communication_channel").innerHTML += communication_channel_option;
      }
    }
  }, reason => {
    let msg = sa.parseErrorMessage(reason);
    console.log(msg);
  });

  // Fill student info.
  updateName(old_student_id);
  document.getElementById("interaction_date").value = old_date;
  if (old_lib_init == "TRUE") {
    document.getElementById("librarian_initiated_yes").checked = true;
  }
  if (old_follow_up == "TRUE") {
    document.getElementById("follow_up_yes").checked = true;
  }
  document.getElementById("time_spent").value = old_time;
  document.getElementById("url").value = old_url;
  document.getElementById("notes").value = old_note;
}

/**
 * This function updates the displayed name based on the current student ID.
 */
function updateName(id = 0) {
  var student_id = document.getElementById("student_id").value;
  if (id != 0) {
    student_id = id;
  }
  sa.getSheet("UPLS").then(response => {
    var name = sa.selectFromTableWhereConditions(response, ["LAST_NAME", "FIRST_NAME", "EMAIL"], [{"header":"STUDENT_ID", "value": student_id}], 0)[0];
    document.getElementById("student_first_name").value = name.FIRST_NAME;
    document.getElementById("student_last_name").value = name.LAST_NAME;
    document.getElementById("student_email").value = name.EMAIL;
  }, reason => {
    let msg = sa.parseErrorMessage(reason);
    console.log(msg);
  });
}

/**
 * This function is used to submit an interaction to the database.
 */
function interactionSubmit() {
  var headers = [
    "STUDENT_ID", //headers[0]
    "INTERACTION_TYPE", //headers[1]
    "INTERACTION_NOTE", //headers[2]
    "INTERACTION_DATE", //headers[3]
    "LIBRARIAN_INITIATED", //headers[4]
    "FOLLOW_UP", //headers[5]
    "MINUTES", //headers[6]
    "COMMUNICATION_CHANNEL", //headers[7]
    "URL", //headers[8]
  ];
  // Collect data to submit.
  var lib_init, follow_up;
  if (document.getElementById("librarian_initiated_yes").checked) {
    lib_init = "TRUE";
  } else {
    lib_init = "FALSE";
  }
  if (document.getElementById("follow_up_yes").checked) {
    follow_up = "TRUE";
  } else {
    follow_up = "FALSE";
  }
  var toSubmit = {
    STUDENT_ID : document.getElementById("student_id").value,
    INTERACTION_TYPE : document.getElementById("interaction_type").value,
    INTERACTION_NOTE : document.getElementById("notes").value,
    INTERACTION_DATE : document.getElementById("interaction_date").value,
    LIBRARIAN_INITIATED : lib_init,
    FOLLOW_UP : follow_up,
    MINUTES : document.getElementById("time_spent").value,
    COMMUNICATION_CHANNEL : document.getElementById("communication_channel").value,
    URL : document.getElementById("url").value,
  };

  if (toSubmit.STUDENT_ID == null) {
    toSubmit.STUDENT_ID = old_student_id;
  }
  if (toSubmit.INTERACTION_TYPE == null) {
    toSubmit.INTERACTION_TYPE = old_interaction_type;
  }
  if (toSubmit.INTERACTION_NOTE == null) {
    toSubmit.INTERACTION_NOTE = old_note;
  }
  if (toSubmit.INTERACTION_DATE == null) {
    toSubmit.INTERACTION_DATE = old_date;
  }
  if (toSubmit.LIBRARIAN_INITIATED == null) {
    toSubmit.LIBRARIAN_INITIATED = old_lib_init;
  }
  if (toSubmit.FOLLOW_UP == null) {
    toSubmit.FOLLOW_UP = old_follow_up;
  }
  if (toSubmit.MINUTES == null) {
    toSubmit.MINUTES = old_time;
  }
  if (toSubmit.COMMUNICATION_CHANNEL == null) {
    toSubmit.COMMUNICATION_CHANNEL = old_comm_chan;
  }
  if (toSubmit.URL == null) {
    toSubmit.URL = old_url;
  }
  var updateConditions = [
    {header: headers[0], value: old_student_id},
    {header: headers[1], value: old_interaction_type},
    {header: headers[2], value: old_note},
    {header: headers[3], value: old_date},
    {header: headers[4], value: old_lib_init},
    {header: headers[5], value: old_follow_up},
    {header: headers[6], value: old_time},
    {header: headers[7], value: old_comm_chan},
    {header: headers[8], value: old_url},
  ];
  console.log("row to be replaced:");
  console.log(headers[0] +":"+old_student_id);
  console.log(headers[1] +":"+old_interaction_type);
  console.log(headers[2] +":"+old_note);
  console.log(headers[3] +":"+old_date);
  console.log(headers[4] +":"+old_lib_init);
  console.log(headers[5] +":"+old_follow_up);
  console.log(headers[6] +":"+old_time);
  console.log(headers[7] +":"+old_comm_chan);
  console.log(headers[8] +":"+old_url);
  console.log("new row info:");
  console.log(toSubmit);
  // Replace data in database.
  sa.getSheet("INTERACTION_TRACKING").then(response => {
    var sheetVals = sa.parseSheetValues(response);
    sa.batchUpdateTable(sheetVals, "INTERACTION_TRACKING", toSubmit, updateConditions).then(res => {
      console.log(res);
      var row = sa.parseBatchUpdate(res);
      console.log("Row " + row + " has been updated in the INTERACTION_TRACKING sheet.");
      alert("Interaction has been updated.");
      window.location.href = "main_page.html";
    }, reason => {
      let msg = sa.parseErrorMessage(reason);
      console.log(msg);
    });
  }, reason => {
    let msg = sa.parseErrorMessage(reason);
    console.log(msg);
  });
}
