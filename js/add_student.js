let sa = new SheetsApi();
sa.handleClientLoad();


function updateSignInStatus(isSignedIn){
    if(isSignedIn){
        //add method
        getHeaders();
        // dispHeaders();
        getLibs();
        console.log("You are Signed In!")
    } else {
        console.log("Need Log In!");
        sa.handleSignInClick();
    }
}
var sheetHeaders;
var fields = [];
var objectArray = [];
var librarians = [];


function getHeaders(){
    sa.getTableHeaders("UPLS").then(response => {
        sheetHeaders = sa.parseTableHeaders(response);
        objectArray[0] = sheetHeaders;
        console.log(sheetHeaders);
        dispHeaders()
    });
}

function dispHeaders() {
    let textField;
    for(let i = 0; i < sheetHeaders.length; i++){
        let headerDiv = document.createElement("div");
        headerDiv.className = "ex1";
        headerDiv.setAttribute("id", "div"+i);
        let txt = document.createTextNode(sheetHeaders[i]);
        headerDiv.appendChild(txt);
        if(sheetHeaders[i] == "LIBRARIAN"){
            textField = document.createElement("select");
            for(let i = 0; i < librarians.length; i++) {
                var option = document.createElement("option");
                option.value = librarians[i];
                option.text = librarians[i];
                textField.appendChild(option);
            }
        }
        else if(sheetHeaders[i] == "DATE_ADDED_TO_SYSTEM"){
            textField = document.createElement("input");
            textField.type = "date";
        }
        else if(sheetHeaders[i] == "STUDENT_ID"){
            textField = document.createElement("input");
            textField.type = "number";
        }
        else if(sheetHeaders[i]  == "EMAIL"){
            textField = document.createElement("input");
            textField.type = "email";
        }
        else {
            textField = document.createElement("input");
        }
        /****ADD SOME VALIDATION TO THIS FOR OTHER FIELDS*/
        textField.setAttribute("id", "field"+i);
        textField.style.cssFloat = "right";

        headerDiv.appendChild(textField);
        document.getElementById("main").appendChild(document.createElement("br"));
        document.getElementById("main").appendChild(document.createElement("br"));

        document.getElementById("main").appendChild(headerDiv);

    }

}

function getData() {
    for(let i = 0; i < sheetHeaders.length; i++) {
        var data = document.getElementById("field"+i).value;
        fields[i] = data;
    }
    objectArray[1] = fields;
    console.log(fields);
    var student = confirm("Are you sure you want to add this student?");
    if(student) {
        sendData();
    } else {}
}

function sendData() {
    objectArray = sa.arrayToObjects(objectArray);
    sa.insertIntoTableColValues(sheetHeaders, "UPLS", objectArray).then(response => {
        console.log(sa.parseInsert(response));
    });

}

function getLibs(){
    sa.getSheet("LIBRARIANS").then(response => {
        console.log(response);
        librarians = sa.parseSheetValues(response);
        console.log(librarians);
    });
}
