/*
 * 	This file handles the communication between the main page and the single search page, telling the search page which function has been requested.
 */
  
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
