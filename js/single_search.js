/*
 * 	This file will handle the JS methods required for the function of the single search page.
 */
 
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
 
 function submitStudent(id, address)
 {
	 localStorage.setItem("studentID", id);
	 window.location.href = address;
 }