/*
 * 	This file will handle the JS methods required for the function of the single search page.
 */
 
let sa = new SheetsApi();
sa.handleClientLoad();
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
    } else {
        console.log("Need Log In!");
        sa.handleSignInClick();
    }
}

 function drawTable() //div id="resultTable"
 {
 }
 
 function showFunctionButton(code)
 /*shows the button for the function requested from main menu
  *invalid code = 00, view student = 10, edit student = 11, view interaction = 20, edit interaction = 21
  */
 {
	 switch(code)
	 {
		 case "10":
		 document.getElementById("viewStudentButton").classList.remove("invisible");
		 break;
		 
		 case "11":
		 document.getElementById("editStudentButton").classList.remove("invisible");
		 break;
		 
		 case "20":
		 document.getElementById("viewInteractionButton").classList.remove("invisible");
		 break;
		 
		 case "21":
		 document.getElementById("editInteractionButton").classList.remove("invisible");
		 break;
		 
		 case "22":
		 document.getElementById("addInteractionButton").classList.remove("invisible");
		 break;
		 
		 default: 
		 alert("Unrecognized function code " + code + " from main page. Redirecting you back to main page. Please try again.");
		 window.location.href = "main_page.html";
	 }
 }
 
  function loadButtonListeners()
 //loads event listeners and their functionality onto page buttons
 {
	 //these are helpers to call js functions in single_search.html
	document.getElementById("viewStudentButton").addEventListener("click", function() {

	});
	
	document.getElementById("editStudentButton").addEventListener("click", function() {
	});
	
	document.getElementById("viewInteractionButton").addEventListener("click", function() {
	});
	
	document.getElementById("editInteractionButton").addEventListener("click", function() {
	});
	
	document.getElementById("addInteractionButton").addEventListener("click", function() {
	});
	
	document.getElementById("searchButton").addEventListener("click", function() {
	//gapi search functionality here
	//booleans for checking if fields filled, default no
	var boolID = false;
	var boolFirst = false;
	var boolLast = false;
	var boolEmail = false;
	
	//check for content
	boolID = Boolean(document.getElementById('idNumberField').value);
	boolFirst = Boolean(document.getElementById('firstNameField').value);
	boolLast = Boolean(document.getElementById('lastNameField').value);
	boolEmail = Boolean(document.getElementById('emailField').value);
	
	//get results of content check
	if(boolID == true || boolFirst == true || boolLast == true || boolEmail == true)
	{
		//remove any previous err message
		document.getElementById("feedBackMessage").classList.toggle("invisible", true);
		
		//submit a search for each field with content 
	}
	else
	{
		//if nothing entered, tell user
		document.getElementById("feedBackMessage").innerHTML = "At least one field must be given a value.";
		document.getElementById("feedBackMessage").classList.toggle("invisible", false);
	}
	
	//getting values
	var idNumber = document.getElementById('idNumberField').value;
	var firstName = document.getElementById('firstNameField').value;
	var lastName = document.getElementById('lastNameField').value;
	var email = document.getElementById('emailField').value;

	});
 }
 
 function submitStudent(id, address)
 {
	 localStorage.setItem("studentID", id);
	 window.location.href = address;
 }