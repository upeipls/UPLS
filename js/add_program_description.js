let sa = new SheetsApi();
sa.handleClientLoad();


function updateSignInStatus(isSignedIn){
    if(isSignedIn){
        //add method
        getHeaders();
        getLibs();
        disp();
        console.log("You are Signed In!")
    } else {
        console.log("Need Log In!");
        sa.handleSignInClick();
    }
}

/** This is a function that gets called by sa.handleClientLoad() and sa.handleSignInClick()
 * when the librarian variable gets set. Anything that depends on knowing the currently logged
 * in librarian should be called from within this function.
 */
function loadPage() {
  addUserInfo();
}

var progDesc = JSON.parse(window.localStorage.getItem("progDesc")); // Retrieving
var librarian = JSON.parse(window.localStorage.getItem("librarian")); // Retrieving
console.log(progDesc);
console.log(librarian);


var librarians = [];
var libField;
var descField;
var objectArray = [];
var sheetHeaders;





function disp() {
    var mainDiv = document.createElement("div");
    mainDiv.className = "ex0";
    mainDiv.style.whiteSpace="pre";

    //mainDiv.style.textAlign = "left";
    var descLabel = document.createTextNode("Program Description: ");
    descField = document.createElement("input");
    descField.value = progDesc;

    var libLabel = document.createTextNode("    Librarian: ");
    libField = document.createElement("select");

    var sendBtn = document.createElement("button");
    sendBtn.setAttribute("id", "sendBtn");
    var btnTxt = document.createTextNode("Send");
    sendBtn.classList.add("small_button");
    sendBtn.appendChild(btnTxt);
    sendBtn.addEventListener("click", function() {
        var send = confirm("Are you sure you want to send this program description?");
        if(send) {
            objectArray[1] = [descField.value, libField.value];
            sendDesc();
        } else {}
    });


    mainDiv.appendChild(descLabel);
    mainDiv.appendChild(descField);

    mainDiv.appendChild(libLabel);
    mainDiv.appendChild(libField);
    mainDiv.appendChild(document.createTextNode("       "));
    mainDiv.appendChild(sendBtn);
    document.getElementById("main").appendChild(mainDiv);

}


function getHeaders(){
    sa.getTableHeaders("PROGRAMS_AND_LIBRARIANS").then(response => {
        sheetHeaders = sa.parseTableHeaders(response);
        objectArray[0] = sheetHeaders;
    });
}

function getLibs(){
    sa.getSheet("LIBRARIANS").then(response => {
        librarians = sa.parseSheetValues(response);
        console.log(librarians);
        for (let i = 1; i < librarians.length; i++) {
            var option = document.createElement("option");
            option.value = librarians[i];
            option.text = librarians[i];
            libField.appendChild(option);
        }
    });
}

function sendDesc() {
    objectArray = sa.arrayToObjects(objectArray);
    sa.getTableHeaders("PROGRAMS_AND_LIBRARIANS").then(response => {
        sheetHeaders = sa.parseTableHeaders(response);
        sa.insertIntoTableColValues(sheetHeaders, "PROGRAMS_AND_LIBRARIANS", objectArray).then(response => {
            console.log(objectArray);
        });
    });
}
