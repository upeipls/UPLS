let sa = SheetsApi();
sa.handleClientLoad();
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        getStudentInfo();
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

function getStudentInfo(){
  var id = window.localStorage.getItem("studentID");
  var condition = {header : "STUDENT_ID",value : id,};
  var headers = [];
  var arrayaa = [];
  var studentInfo = [];
  var conditions = new Array();
  conditions[0] = condition;
  sa.getSheet("UPLS").then(response => {
    headers = sa.parseTableHeaders(response);
    studentInfo = sa.selectFromTableWhereConditions(response,"*",conditions,1);
    console.log(studentInfo);
    var body = document.getElementById("main");
    var table = document.createElement("table");
    table.setAttribute("style", "display: inline-block");
    var tbody = document.createElement("body");
    var commentsRow = document.createElement("tr");
    var commentsHeader = document.createElement("td");
    var commentsContent = document.createElement("td");
    for (var a =0; a < headers.length; a++){
      if (headers[a] != "GENERAL_COMMENT"){
        var row = document.createElement("tr");
	var header = document.createElement("td");
	header.setAttribute("style","text-align: left");
        var headerContent = document.createElement("td");
	headerContent.setAttribute("style","text-align: right");
	var headerText = document.createTextNode(headers[a]);
	var contentText = document.createTextNode(studentInfo[1][a]);
	header.appendChild(headerText);
	headerContent.appendChild(contentText);
	row.appendChild(header);
	row.appendChild(headerContent);
        tbody.appendChild(row);
      }
      if (headers[a] == "GENERAL_COMMENT"){
        var generalCommentHeader = document.createTextNode(headers[a]);
	var commentInput = document.createElement('textarea');
        commentInput.disabled = true;
	var commentsString = studentInfo[1][a];
	commentInput.innerHTML = (commentsString);
	commentsHeader.appendChild(generalCommentHeader);
        commentsContent.appendChild(commentInput);
	commentsRow.appendChild(commentsHeader);
	commentsRow.appendChild(commentsContent);
      }
    }
    tbody.appendChild(commentsRow);
    table.appendChild(tbody);
    body.appendChild(table);
    var editBtn = document.createElement("BUTTON");
    var t = document.createTextNode("Go to edit student");
    editBtn.onclick = function(){
      window.location.href="edit_student.html";
    };
    editBtn.appendChild(t);
    editBtn.setAttribute("class","small_button");
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    cell.setAttribute("colspan", "2");
    cell.setAttribute("style", "text-align: center");
    editBtn.setAttribute("style", "display: inline-block");
    cell.appendChild(editBtn);
    row.appendChild(cell);
    tbody.appendChild(row);
  });
}
