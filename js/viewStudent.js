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
