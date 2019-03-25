let sa = new SheetsApi();
sa.setKeys("1n2w0s1lqSZ4kHX3zeNYT-UNRPEr1aextWaG_bsJisn8", "AIzaSyDeampVGzzd8NvBiUtEsNVmNkAQU1TZ17I", "21358841826-edt9rotek8r1rbivt91nabpn2sc2g6ts.apps.googleusercontent.com");
sa.handleClientLoad();
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        loadHeaders();
    } else {
        console.log("Need Log In!");
        sa.handleSignInClick();
    }
}

let sheetHeaders;
function loadHeaders() {
    if (sheetName === "INTERACTIONS") {
        sa.getSheet(sheetName).then(response => {
            let values = sa.parseSheetValues(response);
            sheetHeaders = [];
            for (let i = 1; i < values.length; i++) {
                if (values[i][0]) sheetHeaders[sheetHeaders.length] = values[i][0];
            }
            generateHeadersTable();
        });
    } else if (sheetName === "UPLS") {
        sa.getTableHeaders(sheetName).then(response => {
            sheetHeaders = sa.parseTableHeaders(response);
            generateHeadersTable();
        });
    } else {
        sa.getSheet("INTERACTIONS").then(response => {
            let values = sa.parseSheetValues(response);
            sheetHeaders = [];
            for (let i = 1; i < values.length; i++) {
                if (values[i][1]) sheetHeaders[sheetHeaders.length] = values[i][1];
            }
            generateHeadersTable();
        });
    }
}

function generateHeadersTable() {
    if (sheetName === "UPLS") {
        sa.getDataType().then(res=> {
            let types = sa.parseDataType(res, sheetHeaders);
            if (types.length !== sheetHeaders.length) {
                console.log("Error in getDataType!");
                console.log(types);
                console.log(sheetHeaders);
            } else {
                let str = "<tr><th>Column Name</th><th>Data Type</th><th>Vocabulary</th><th>Operation</th></tr>";
                for (let i = 0; i < sheetHeaders.length; i++) {
                    str += "<tr id=\"" + i + "\"><td>" + sheetHeaders[i] + "</td><td>" + types[i] + "</td><td>-</td><td><button class='borderless-btn' onclick='editHeaderCard(this)'><i class='fas fa-pen'></i></button></td></tr>";
                }
                str += "<tr><td>/</td><td>/</td><td>/</td><td><button class='borderless-btn' onclick='addNewHeader()'><i class='fas fa-plus'></i></button></td></tr>";
                document.getElementById("headers_table").innerHTML = str;
            }
        });
    } else {
        let str = "<tr><th>" + (sheetName==="INTERACTIONS"?"Interaction Type":"Communication Channel") + "</th><th>Operation</th></tr>";
        for (let i = 0; i < sheetHeaders.length; i++) {
            str += "<tr id=\"" + i + "\"><td>" + sheetHeaders[i] + "</td><td>/</td></tr>";
        }
        str += "<tr><td>/</td><td><button class='borderless-btn' onclick='addNewHeader()'><i class='fas fa-plus'></i></button></td></tr>";
        document.getElementById("headers_table").innerHTML = str;
    }
}

function addNewHeader() {
    document.getElementById("add-card").classList.remove("invisible");
    blurContent();
}

function addHeader() {
    let headerName = document.getElementById("new-header-name").value;
    //let headerType = document.getElementById("new-header-type")?document.getElementById("new-header-type").value:undefined;
    let vocabulary = document.getElementById("new-vocabulary")?document.getElementById("new-vocabulary").value:undefined;
    if (sheetName === "INTERACTIONS") {
        sa.insertIntoTableColValues(["INTERACTIONS_LIST"], "INTERACTIONS", [{
            "INTERACTIONS_LIST": headerName
        }]).then(response => {
            if (sa.parseInsert(response) === 1) {
                console.log("Success");
            }
            loadHeaders();
            closeCard();
        });
    } else if (sheetName === "UPLS") {
        sa.getTableHeaders(sheetName).then(response => {
            sa.alterTableAddCol(sheetName, [headerName], sa.parseTableHeaders(response).length).then(response => {
                console.log(sa.parseAlter(response));
                loadHeaders();
                closeCard();
            });
        });
    } else {
        let index = sheetHeaders.length + 2;
        sa.insertIntoTableColValues(["COMMUNICATION_CHANNEL"], "INTERACTIONS!B"+index+":B" + index, [{
            "COMMUNICATION_CHANNEL": headerName
        }]).then(response => {
            if (sa.parseInsert(response) === 1) {
                console.log("Success");
            }
            loadHeaders();
            closeCard();
        });
    }
}

function closeCard() {
    if (sheetName === "UPLS") {
        document.getElementById("new-vocabulary").value = "";
        document.getElementById("edit-card").classList.add("invisible");
    }
    document.getElementById("new-header-name").value = "";
    document.getElementById("add-card").classList.add("invisible");
    document.getElementById("disable-canvas").classList.add("invisible");
    document.getElementById("content").classList.remove("blur");
    document.getElementById("content").classList.add("remove-blur");
}

let notation = "";
function editHeaderCard(object) {
    let columnName = object.parentElement.parentElement.children[0].innerHTML;
    document.getElementById("header-name").value = columnName;
    document.getElementById("vocabulary").value = "Some vocabulary";
    document.getElementById("edit-card").classList.remove("invisible");
    blurContent();
    if (sheetName === "INTERACTIONS"){
        let index = object.parentElement.parentElement.id + 2;
        notation = "A" + index;
    } else if (sheetName === "UPLS") {
        notation = sa.getNotationFromColName(sheetHeaders, columnName) + "1";
    } else {
        let index = object.parentElement.parentElement.id + 2;
        notation = "B" + index;
    }
}

function editHeader() {
    let inputRange = sheetName + "!" + notation + ":" + notation;
    sa.update(inputRange, [[document.getElementById("header-name").value]]).then(response => {
        if (sa.parseUpdate(response) === 1) {
            console.log("Successfully update the header.");
            loadHeaders();
        } else {
            alert("Something is wrong.");
        }
        closeCard();
    });
}

function blurContent() {
    document.getElementById("disable-canvas").classList.remove("invisible");
    document.getElementById("content").classList.remove("remove-blur");
    document.getElementById("content").classList.add("blur");
}
