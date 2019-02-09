/*
 * This file will have a method to create the main menu for multiple pages.
 */

function mainMenu() {
	var main_menu = "\
	<a href=\"main_page.html\">Home</a>\
	<a href=\"add_student.html\">Add Student</a>\
	<a href=\"group_email.html\">Group Email</a>\
	<a href=\"\"></a>\
	<a href=\"\"></a>\
	<a href=\"\"></a>\
	<a href=\"\"></a>\
	<a href=\"\"></a>\
	";
  document.getElementById("main_menu").innerHTML = main_menu;
}
