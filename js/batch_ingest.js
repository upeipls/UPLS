
var sa = new SheetsApi();
sa.handleClientLoad();

function updateSignInStatus(isSignedIn){
    if(isSignedIn){
        getProgs();
        getID();
        console.log("You are Signed In!")
    } else {
        console.log("Need Log In!");
        sa.handleSignInClick();
    }
}



//Global Variables
let sheetHeaders;
let objectArray;
var data = [];
var validatedData = [];
var invalidData = [];
var idArray = [];
var idInfo = [];
var progArray = [];
var progInfo = [];

/*INVALID DATA ARRAYS*/
var invalidID = [];
var invalidEmail = [];
var dupeID = [];
var invalidText = [];
var invalidProg = [];
var invalidDate = [];
var invalidCataYear = [];

var validCount = 1;

/*INVALID DATA COUNTERS*/
var invalidEmailCount = 1;
var invalidIDCount = 1;
var duplicateIDCount = 1;
var invalidCYCount = 1;
var invalidProgCount = 1;
var invalidDateCount = 1;



//DATE
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var currentDate = year + "-" + month + "-" + day;
console.log(currentDate);



//function to get data from TSV file
function openFile(event) {
    var input = event.target;
    var reader = new FileReader();
    //reader returns result, split data by newline and by tab
    //results are stored in 2D array of [row][column]
    reader.onload=function(){
        var text = reader.result;
        data = text.split('\n');

        for(var i = 0; i < data.length; i++) {
            let temp = data[i].split('\t');
            data[i] = temp;
        }
        //put ids into own array



        //put programs into own array


        validatedData[0] = data[0];
        invalidData[0] = data[0];

        invalidID[0] = data[0];
        invalidEmail[0] = data[0];
        dupeID[0] = data[0];
        invalidText[0] = data[0];
        invalidProg[0] = data[0];
        invalidDate[0] = data[0];
        invalidCataYear[0] = data[0];

        /*VALIDATE DATA*/
        for(var j = 1; j < data.length; j++){


           if(!validateEmail(data, j)) {
                invalidEmail[invalidEmailCount] = data[j];
                invalidEmailCount++;
           }
           if(!validateID(data, j)) {
                invalidID[invalidIDCount] = data[j];
                invalidIDCount++;
           }
           if(!validateDate(data, j)) {
               invalidDate[invalidDateCount] = data[j];
               invalidDateCount++;
           }
           if(!validateCatYear(data, j)) {
               invalidCataYear[invalidCYCount] = data[j];
               invalidCYCount++;
           }
           if(!validateProg(data, j)) {
               invalidProg[invalidProgCount] = data[j];
               invalidProgCount++;
           }
           if(!validateDuplicate(data, j)) {
               dupeID[duplicateIDCount] = data[j];
               duplicateIDCount++;
           }
           if (validateEmail(data, j) && validateID(data, j) && validateDate(data, j) && validateCatYear(data, j) && validateProg(data, j) && validateDuplicate(data, j)) {
               validatedData[validCount] = data[j];
               validCount++;
           }
        }

        /*ADD CURRENT DATE TO VALIDATED DATA*/
        for(let i = 1; i < validatedData.length; i++) {
            validatedData[i][15] = currentDate;
        }
        console.log(data);
        console.log(validatedData);
        console.log(invalidData);
        /*SEND ERRORS TO ERROR PAGE*/
        window.localStorage.setItem("emailErrors",JSON.stringify(invalidEmail));
        window.localStorage.setItem("idErrors",JSON.stringify(invalidID));
        window.localStorage.setItem("progErrors",JSON.stringify(invalidProg));
        window.localStorage.setItem("dateErrors",JSON.stringify(invalidDate));
        window.localStorage.setItem("cataErrors",JSON.stringify(invalidCataYear));
        window.localStorage.setItem("dupeIdErrors",JSON.stringify(dupeID));



    };
    console.log(input);
    reader.readAsText(input.files[0]);
}

//function to send data to sheet
function sendToSheet() {
    let actualRows = validatedData.length - 1;
    /*var rowNum = confirm("Are you sure you want to send " + data.length + " rows?");
    if (rowNum) {
        objectArray = arrayToObjects(validatedData);
        sa.getTableHeaders("UPLS").then(response => {
            sheetHeaders = sa.parseTableHeaders(response);
            sa.insertIntoTableColValues(sheetHeaders, "UPLS", objectArray).then(response => {
                console.log(sa.parseInsert(response));
            });
        });
    } else {}
    var errors = confirm("Only " + actualRows + " uploaded. To see errors, click OK");
    if(errors) {
        window.open("errors.html", "_blank");
    }*/


    var submittableRows = data.length - 1; // The data array includes a header row.
    if (actualRows != submittableRows) {
        var errors = confirm("Only " + actualRows + " out of " + submittableRows + " are valid. Click 'OK' to see errors, then fix them and try again.");
        if (errors) {
            window.open("errors.html", "_blank");
        }
    } else {
        // Insert the code that submits stuff to the sheet.
        objectArray = arrayToObjects(validatedData);
        sa.getTableHeaders("UPLS").then(response => {
            sheetHeaders = sa.parseTableHeaders(response);
            sa.insertIntoTableColValues(sheetHeaders, "UPLS", objectArray).then(response => {
                console.log(sa.parseInsert(response));
            });
        });
    }
}

//validate email cells
function validateEmail(data,x){
    //validate email address
    if(data[x][3].includes("@")){
        return true;
    } else{
        return false;
    }
}
//validate ID
function validateID(data,x){
    //validate student ID
    if(data[x][0].match(/^[0-9]+$/)){
        return true;
    } else{
        return false;
    }
}
//validate any column with text(alpha only)
function validateText(data,x,y) {
    //validate any text
    if(!data[x][y].match(/^[A-Z]/)){
        return false;
    } else{
        return true;
    }
}
//validate Catalog year
function validateCatYear(data,x){
    //validate catalog year
    if(data[x][10].match(/^\d{4}-\d{4}$/)){
        return true;
    } else{
        return false;
    }
}
//validate ingest date, probably not necessary
function validateDate(data, x){
    //validate the ingest date just to be sure
    if(data[x][15].match(/^\d{4}-\d{2}-\d{2}$/)){
        return true;
    } else{
        return false;
    }
}
//check for duplicate ID's
function validateDuplicate(data,x){

    if(idArray.includes(data[x][0])){
        return false;
    } else { return true; }

}
//Check if program exists in sheet
function validateProg(data, x){
    //check programs_and_librarians to see if data[x][6] is it, if not open a new window to add the program desc in programs_and_libs
    if(progArray.includes(data[x][6])){
        return true;
    } else {return false;}


}

//function for 2D array to object array
function arrayToObjects(array) {
    let headers = array[0];
    let result = [];
    let tempStr = "";
    for (let i = 1; i < array.length; i++) {
        tempStr = "{";
        for (let j = 0; j< array[i].length; j++) {
            tempStr += "\"" + headers[j] + "\":\"" + array[i][j] + "\"";
            if (j < array[i].length - 1) {
                tempStr += ",";
            }
        }
        tempStr += "}";
        console.log(tempStr);
        result[i-1] = JSON.parse(tempStr.replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t")
            .replace(/\f/g, "\\f"));
    }
    return result;
}


//GET STUDENT IDS
function getID() {
    sa.getSheet("UPLS").then(response => {
        idInfo = sa.parseSheetValues(response);
        console.log(idInfo);
        for(let i = 1; i < idInfo.length; i++){
            idArray[i] = idInfo[i][0];
        }
        console.log(idArray);

    });
}
//GET LIST OF PROGRAMS
function getProgs() {
    sa.getSheet("PROGRAMS_AND_LIBRARIANS").then(response => {
        progInfo = sa.parseSheetValues(response);
        console.log(progInfo);
        for(let i = 1; i < progInfo.length; i++){
            progArray[i] = progInfo[i][0];
        }
        console.log(progArray);
    });
}

