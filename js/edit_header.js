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

let sheetVocabs;
function generateHeadersTable() {
    if (sheetName === "UPLS") {
        sa.getDataType().then(res=> {
            let types = sa.parseDataType(res, sheetHeaders);
            sheetVocabs = sa.parseVocab(res, sheetHeaders);
            if (types.length !== sheetHeaders.length) {
                console.log("Error in getDataType!");
                console.log(types);
                console.log(sheetHeaders);
            } else {
                let str = "<tr><th>Column Name</th><th>Data Type</th><th>Vocabulary</th><th>Operation</th></tr>";
                for (let i = 0; i < sheetHeaders.length; i++) {
                    str += "<tr id=\"" + i + "\"><td>" + sheetHeaders[i] + "</td><td>" + types[i] + "</td><td>" + (sheetVocabs[i]!==undefined?"Yes":"No") + "</td><td><button class='borderless-btn' onclick='editHeaderCard(this)'><i class='fas fa-pen'></i></button></td></tr>";
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
    let headerName = document.getElementById("new-header-name").value.trim();
    let headerType = document.getElementById("new-header-type")?document.getElementById("new-header-type").value:undefined;
    let vocabulary = document.getElementById("new-vocabulary")?document.getElementById("new-vocabulary").value.trim():undefined;
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
                sa.getTableHeaders("HEADER_VOCAB_TYPE").then(response => {
                    let notation = sa.getCharFromNum(sa.parseTableHeaders(response).length);
                    let inputValues = [[headerName],[headerType]];
                    if (vocabulary !== "undefined") {
                        let vocabs = vocabulary.split(",");
                        for (let i = 0; i < vocabs.length; i++) {
                            inputValues[inputValues.length] = [vocabs[i]];
                        }
                    }
                    sa.update("HEADER_VOCAB_TYPE!" + notation + "1:" + notation + "" + inputValues.length, inputValues).then(res=> {
                        loadHeaders();
                        closeCard();
                    })
                });
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
    //document.getElementById("main_menu").classList.remove("blur");
    //document.getElementById("main_menu").classList.add("remove-blur");
}

let notation = "";
let columnName;
function editHeaderCard(object) {
    columnName = object.parentElement.parentElement.children[0].innerHTML;
    let columnId = object.parentElement.parentElement.id;
    document.getElementById("header-name").value = columnName;
    document.getElementById("header-type").value = object.parentElement.parentElement.children[1].innerHTML;
    document.getElementById("vocabulary").value = sheetVocabs[columnId];
    document.getElementById("edit-card").classList.remove("invisible");
    blurContent();
    notation = sa.getNotationFromColName(sheetHeaders, columnName) + "1";
}

function editHeader() {
    let inputRange = sheetName + "!" + notation + ":" + notation;
    if (document.getElementById("vocabulary").value === "undefined" || document.getElementById("vocabulary").value === "") {
        closeCard();
        return;
    }
    sa.update(inputRange, [[document.getElementById("header-name").value]]).then(response => {
        if (sa.parseUpdate(response) === 1) {
            sa.getTableHeaders("HEADER_VOCAB_TYPE").then(res => {
                let headers = sa.parseTableHeaders(res);
                let vocabNotation = sa.getNotationFromColName(headers, columnName);
                let vocabValues = [];
                let tempStrings = document.getElementById("vocabulary").value.split(",");
                for (let i = 0; i < tempStrings.length; i++) {
                    vocabValues[i] = [tempStrings[i]];
                }
                sa.update("HEADER_VOCAB_TYPE!" + vocabNotation + "3:" + vocabNotation + (vocabValues.length + 3), vocabValues).then(res => {
                    loadHeaders();
                });
            });
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
    //document.getElementById("main_menu").classList.remove("remove-blur");
    //document.getElementById("main_menu").classList.add("blur");
}
