function start(){
/*Just here for testing purposes*/
let sa = SheetsApi("1n2w0s1lqSZ4kHX3zeNYT-UNRPEr1aextWaG_bsJisn8","AIzaSyDeampVGzzd8NvBiUtEsNVmNkAQU1TZ17I","21358841826-edt9rotek8r1rbivt91nabpn2sc2g6ts.apps.googleusercontent.com");
sa.handleClientLoad();
//real API call, with no information needed to create a sheet. must input
//Google data for the UPLS Google Account being used
/*let sa = SheetsApi();
sa.setKeys(inputSheetId, inputApiKey,inputClientId);*/
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
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        getStudentInfo();
    } else {
        console.log("Need Log In!");
        sa.handleSignInClick();
    }
}

function getStudentInfo(){
	var studentID = new Array();
	function getParams(){
		var idx = document.URL.indexOf('?');
		var params = new Array();
		if (idx != -1) {
			var pairs = document.URL.substring(idx+1, document.URL.length).split('&');
			for (var i=0; i<pairs.length; i++){
				nameVal = pairs[i].split('=');
				params[nameVal[0]] = nameVal[1];
			}
		}
		return params;
	}
params = getParams();
studentID[0] = unescape(params["studentID"]);
console.log(studentID[0]);
	var idValue = "100452";
	var condition = {
		header : "STUDENT_ID",
		value : studentID[0],
	};
	var headers = [];
	var arrayaa = [];
	var studentInfo = [];
	var test = [];
	var conditions = new Array();
	conditions[0] = condition;
		sa.getSheet("UPLS").then(response => {
			(sa.getTableHeaders(response));
			headers = sa.parseTableHeaders(response);
				sa.getSheet("UPLS").then(response => {
				(sa.parseSheetValues(response));
				arrayaa = sa.selectFromTableWhereConditions(response,"*",conditions,1);
				studentInfo = sa.parseSheetValues(response);
				test = headers;
				var body = document.getElementsByTagName("body")[0];
				var table = document.createElement("table");
				var tbody = document.createElement("body");
				for (var a =0; a < headers.length; a++){
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
				table.appendChild(tbody);
			  // put <table> in the <body>
			  body.appendChild(table);
			  table.setAttribute("border", "2");
			  table.setAttribute("id","studentTable");
			  var input = document.createElement("input"); 
			  input.setAttribute('type', 'text');
			  input.setAttribute("value","Add Notes Here");
			  body.appendChild(input);
			  var btn = document.createElement("BUTTON");
			  var t = document.createTextNode("Return to Search");
			  btn.onclick = function(){
			  	window.location.href="index.html";
			  };
			  btn.appendChild(t);
			  btn.setAttribute("class","flow_button");
			  body.appendChild(btn);
			

			});
		});		
}
