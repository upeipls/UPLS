/*
 * This file will have a method to create the main menu for multiple pages.
 */

function mainMenu() {
	var main_menu = "\
	<a href=\"main_page.html\">Home</a>\
	<a href=\"add_student.html\">Add Student</a>\
	<a href=\"group_email.html\">Group Email</a>\
	<a href=\"aggregation.html\">Aggregate</a>\
	<a href=\"view_student.html\">View Student</a>\
   <button onmouseover=\"dropdown()\" id=\"dropdown\">Admin Menu</button>\
   <div id=\"dropdown_items\" class=\"dropdown_items\">\
     <a href=\"batch_ingest.html\">Batch Ingest</a>\
     <a href=\"edit_interaction_categories.html\">Interaction Categories</a>\
     <a href=\"edit_student_categories.html\">Student Categories</a>\
	</div>\
	";
  document.getElementById("main_menu").innerHTML = main_menu;
}

function dropdown() {
	document.getElementById("dropdown_items").classList.toggle("show");
}
