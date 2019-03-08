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

function mainMenu() {
	var main_menu = "\
	<form action=\"index.html\" class=\"menu_bar_form\">\
		<button type=\"submit\" class=\"flow_button\">Home</button>\
	</form>\
	<form action=\"add_student.html\" class=\"menu_bar_form\">\
		<button type=\"submit\" class=\"flow_button\">Add Student</button>\
	</form>\
	<form action=\"group_email.html\" class=\"menu_bar_form\">\
		<button type=\"submit\" class=\"flow_button\">Group Email</button>\
	</form>\
	<form action=\"aggregation.html\" class=\"menu_bar_form\">\
		<button type=\"submit\" class=\"flow_button\">Aggregate</button>\
	</form>\
	<form action=\"view_student.html\" class=\"menu_bar_form\">\
		<button type=\"submit\" class=\"flow_button\">View Student</button>\
	</form>\
	<button onclick=\"dropdown()\" id=\"dropdown\"  class=\"admin_flow_button\">Admin Menu</button>\
	<div id=\"dropdown_items\" class=\"dropdown_items\" paddingTop=\"2px\">\
	<form action=\"batch_ingest.html\" class=\"menu_bar_form\">\
		<button type=\"submit\" class=\"admin_flow_button\">Batch Ingest</button>\
	</form>\
	<form action=\"edit_interaction_categories.html\" class=\"menu_bar_form\">\
		<button type=\"submit\" class=\"admin_flow_button\">Interaction Categories</button>\
	</form>\
	<form action=\"edit_student_categories.html\" class=\"menu_bar_form\">\
		<button type=\"submit\" class=\"admin_flow_button\">Student Categories</button>\
	</form>\
	</div>\
	";
	document.getElementById("main_menu").innerHTML = main_menu;
}
function dropdown() {
	document.getElementById("dropdown_items").classList.toggle("show");
}


function getStudentInfo(){
  var url_string = window.location.href;
  var url = new URL(url_string);
  var id = url.searchParams.get("studentID");
  var condition = {
	header : "STUDENT_ID",
	value : id,
  };
	var headers = [];
	var arrayaa = [];
	var studentInfo = [];
	var conditions = new Array();
	conditions[0] = condition;
		sa.getSheet("UPLS").then(response => {
			(sa.getTableHeaders(response));
			headers = sa.parseTableHeaders(response);
				sa.getSheet("UPLS").then(response => {
				(sa.parseSheetValues(response));
				arrayaa = sa.selectFromTableWhereConditions(response,"*",conditions,1);
				studentInfo = sa.parseSheetValues(response);
				//div for scrollable General Comments Field
				var pageDiv = document.createElement('div');
			  	var commentsDiv = document.createElement('div');
			  //commentsDiv.className = 'p';
			  	var body = document.getElementsByTagName("body")[0];
				var table = document.createElement("table");
				var tbody = document.createElement("body");
				var commentsRow = document.createElement("tr");
				var commentsHeader = document.createElement("td");
				var commentsContent = document.createElement("td");
				for (var a =0; a < headers.length; a++){
					if (headers[a] != "GENERAL_COMMENT"){
						var row = document.createElement("tr");
						var data = document.createElement("td");
						var data2 = document.createElement("td");
						var text1 = document.createTextNode(headers[a]);
						var text2 = document.createTextNode(studentInfo[0][a]);
						data.appendChild(text1);
						data2.appendChild(text2);
						row.appendChild(data);
						row.appendChild(data2);
						tbody.appendChild(row);
					}
					if (headers[a] == "GENERAL_COMMENT"){
						var generalCommentHeader = document.createTextNode(headers[a]);
						var div = document.createElement('div');
						div.setAttribute("style","float: right;height:50px;width:120px;border:1px solid #ccc;overflow:auto;");
						var commentsString = document.createTextNode(studentInfo[0][a]);
						div.appendChild(commentsString);
						commentsHeader.appendChild(generalCommentHeader);
						commentsContent.appendChild(div);
						commentsRow.appendChild(commentsHeader);
						commentsRow.appendChild(commentsContent);
					}

				}
				tbody.appendChild(commentsRow);
				table.appendChild(tbody);
			  	body.appendChild(table);
			  	table.setAttribute("border", "2");
			  	table.setAttribute("id","studentTable");
			  	//BELOW IS FOR DISPLAYING AS INDIVIDUAL DIVS AND NOT AS A TABLE, NOT AS PRETTY
			  /*for (var i = 0; i < headers.length; i++){
			  	if (headers[i] != "GENERAL_COMMENT"){
			  		  var iDiv = document.createElement('div');
					  iDiv.setAttribute("style","height:20px");
					  var leftText = document.createElement("P");
					  leftText.setAttribute("class","fl-lt");
					  var text = document.createTextNode(headers[i]);
					  leftText.appendChild(text);
					  var rightText = document.createElement("P");
					  rightText.setAttribute("class","fl-rt");
					  rightText.setAttribute("style","height:20px;");
					  var text2 = document.createTextNode(studentInfo[0][i]);
					  rightText.appendChild(text2);
					  iDiv.appendChild(leftText);
					  iDiv.appendChild(rightText);
					  iDiv.setAttribute("style","clear: both;padding 0px");
					  document.getElementsByTagName('body')[0].appendChild(iDiv);
			  	}
			  	if (headers[i] == "GENERAL_COMMENT"){
			  		var commentHeader = document.createElement("P");
			  		commentHeader.setAttribute("class","fl-lt");
			  		var text = document.createTextNode(headers[i]);
			  		commentHeader.appendChild(text);
			  		var scrollable = document.createElement("P");
			  		scrollable.setAttribute("style","height:120px;width:120px;border:1px solid #ccc;overflow:auto;");
			  		var scrollableText = document.createTextNode(studentInfo[0][i]);
			  		scrollable.setAttribute("class","fl-rt");
			  		scrollable.appendChild(scrollableText);
			  		commentsDiv.appendChild(commentHeader);
			  		commentsDiv.appendChild(scrollable);
			  		commentsDiv.setAttribute("style","clear: both");
			  	}
			  
			  }*/
			  
			  document.getElementsByTagName('body')[0].appendChild(commentsDiv);
			  var buttonDiv = document.createElement('div');
			  var btn = document.createElement("BUTTON");
			  var t = document.createTextNode("Go to edit student");
			  btn.onclick = function(){
			  	window.location.href="edit_student.html";
			  };
			  btn.appendChild(t);
			  btn.setAttribute("class","flow_button");
			  buttonDiv.appendChild(btn);
			  document.getElementsByTagName('body')[0].appendChild(buttonDiv);
			});
		});		
}
