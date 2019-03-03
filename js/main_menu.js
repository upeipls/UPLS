/*
 * This file will have a method to create the main menu for multiple pages.
 */

function mainMenu() {
	var main_menu = "\
	<form action=\"main_page.html\" class=\"menu_bar_form\">\
		<button type=\"submit\" class=\"flow_button\">Home</button>\
	</form>\
	<form action=\"add_student.html\" class=\"menu_bar_form\">\
		<button type=\"submit\" class=\"flow_button\">Add Student</button>\
	</form>\
	<form action=\"add_student_interaction.html\" class=\"menu_bar_form\">\
		<button type=\"submit\" class=\"flow_button\">Add Student Interaction</button>\
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
