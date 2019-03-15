/*
 * 	This file handles the communication between the main page and the single search page, telling the search page which function has been requested.
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

  //send function code to single search page
function toSingleSearch(code)
{
	//invalid code = 00, view student = 10, edit student = 11, view interaction = 20, edit interaction = 21, add interaction = 22
	localStorage.setItem("functionCode", code);
	window.location.href = "single_search.html";
	
}

//send user to page that doesn't require code
function toPage(address)
{
	window.location.href = address;
}

//add button functionality
function loadButtonListeners()
{
	//these are helpers to call js functions in main_page.html
	document.getElementById("addStudentButton").addEventListener("click", function() {
		toPage("add_student.html");
	});
	
	document.getElementById("emailButton").addEventListener("click", function() {
		toPage("group_email.html");
	});
	
	document.getElementById("viewStudentButton").addEventListener("click", function() {
		toSingleSearch(10);
	});
	
	document.getElementById("editStudentButton").addEventListener("click", function() {
		toSingleSearch(11);
	});
	
	document.getElementById("viewInteractionButton").addEventListener("click", function() {
		toSingleSearch(20);
	});
	
	document.getElementById("editInteractionButton").addEventListener("click", function() {
		toSingleSearch(21);
	});
	
	document.getElementById("addInteractionButton").addEventListener("click", function() {
		toSingleSearch(22);
	});
	
	document.getElementById("ingestButton").addEventListener("click", function() {
		toPage("batch_ingest.html");
	});
	
	document.getElementById("intCategoryButton").addEventListener("click", function() {
		toPage("edit_interaction_categories.html");
	});
	
	document.getElementById("studentCategoryButton").addEventListener("click", function() {
		toPage("edit_student_categories.html");
	});
	
}
