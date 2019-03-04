let sa = new SheetsApi();
sa.setKeys("1n2w0s1lqSZ4kHX3zeNYT-UNRPEr1aextWaG_bsJisn8", "AIzaSyDeampVGzzd8NvBiUtEsNVmNkAQU1TZ17I", "21358841826-edt9rotek8r1rbivt91nabpn2sc2g6ts.apps.googleusercontent.com");
sa.handleClientLoad();

let sheetHeaders;
let criteriaIndex = 1;
let stepNumber = 1;

function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        sa.getTableHeaders("UPLS").then(res => {
            sheetHeaders = sa.parseTableHeaders(res);
            addCriteria();
            document.getElementById("criteria").classList.remove("invisible");
        });
    } else {
        console.log("Need Log In!");
        sa.handleSignInClick();
    }
}

function backStep() {
    if (stepNumber === 1) {
        window.location.href = "http://localhost:8000/main_page.html";
    } else if (stepNumber === 2) {
        document.getElementById("template").classList.add("invisible");
        document.getElementById("criteria").classList.remove("invisible");
        stepNumber = 1;
    } else {
        document.getElementById("preview").classList.add("invisible");
        document.getElementById("template").classList.remove("invisible");
        stepNumber = 2;
    }
}

function nextStep() {
    if (stepNumber === 1) {
        document.getElementById("template").classList.remove("invisible");
        document.getElementById("criteria").classList.add("invisible");
        stepNumber = 2;
    } else if (stepNumber === 2) {
        loadDraft();
    }
}

function addCriteria() {
    let options = "";
    for (let i = 0; i < sheetHeaders.length; i++) {
        options += "<option>" + sheetHeaders[i] + "</option>";
    }
    let str = "<div id=\"criteria_" + criteriaIndex + "\">" +
        "<table>" +
        "<tr>" +
        "<td><button class=\"close_button\" onclick=\"deleteCriteria(this)\"></button></td>" +
        "<td><label for=\"select_criteria_" + criteriaIndex + "\">Criteria: </label></td>" +
        "<td><select id=\"select_criteria_" + criteriaIndex + "\" onchange=\"getVocabulary(this.value," + criteriaIndex + ")\">" + options + "</select></td>" +
        "</tr>" +
        "<tr>" +
        "<td></td>" +
        "<td><label for=\"select_values_" + criteriaIndex + "\">Values:</label></td>" +
        "<td><select id=\"select_values_" + criteriaIndex + "\" onchange=\"updatePopulation()\"></select></td>" +
        "</tr>" +
        "</table>" +
        "</div>";
    let div = document.createElement("div");
    document.getElementById("criteria").appendChild(div);
    div.outerHTML = str;
    criteriaIndex++;
}

function deleteCriteria(object) {
    object.parentElement.parentElement.parentElement.parentElement.outerHTML = "";
}

function getVocabulary(header, index) {
    let vocab = [];
    let notation = sa.getNotationFromColName(sheetHeaders, header);
    sa.getSheet("UPLS!" + notation + ":" + notation).then(res => {
        let values = sa.parseSheetValues(res);
        for (let i = 1; i < values.length; i++) {
            if (!vocab.includes(values[i][0])) {
                vocab[vocab.length] = values[i][0];
            }
        }
        setVocabulary(vocab, index);
    });
}

function setVocabulary(values, index) {
    let options = "";
    for (let i = 0; i < values.length; i++) {
        options += "<option>" + values[i] + "</option>";
    }
    document.getElementById("select_values_" + index).innerHTML = options;
}

let emailAddresses = [], names = [];
function updatePopulation() {
    emailAddresses = [];
    names = [];
    let header, value, conditions = [];
    for (let i = 1; i < criteriaIndex; i++) {
        if (document.getElementById("criteria_" + i).innerHTML === "") continue;
        header = document.getElementById("select_criteria_" + i).value;
        value = document.getElementById("select_values_" + i).value;
        console.log(header + ":" + value);
        conditions[conditions.length] = {"header":header, "value": value};
    }
    console.log(conditions);
    sa.getSheet("UPLS").then(res => {
        let result = sa.selectFromTableWhereConditions(res, ["FIRST_NAME","LAST_NAME","EMAIL"], conditions, 1).slice(1);
        for (let i = 0; i < result.length; i++) {
            names[names.length] = result[i][0] + " " + result[i][1];
            emailAddresses[emailAddresses.length] = result[i][2];
        }
        document.getElementById("number_label").innerHTML = "This group currently contains " + (emailAddresses.length) + " people.";
    });
}

let draftId, draftMessage;
function loadDraft() {
    let subject = document.getElementById("input_subject").value;
    sa.getDraftBySubject(subject).then(res => {
        let draft = sa.parseDraftBySubject(res);
        if (draft === null) {
            alert("No draft found! Please check the subject line.");
        } else if (draft.length > 1) {
            alert("More than one draft found! Please use a more precise subject line.");
        } else {
            draft.then(res => {
                draftId = res.result.id;
                let raw = res.result.message.raw;
                draftMessage = sa.decode(raw);
                displayContent(draftMessage);
                document.getElementById("preview").classList.remove("invisible");
                document.getElementById("template").classList.add("invisible");
                stepNumber = 3;
            });
        }
    })
}

function displayContent(msg) {
    console.log(msg);
    document.getElementById("email_subject").innerHTML =
        msg.substr(msg.indexOf("Subject: ") + 9, msg.indexOf("From") - msg.indexOf("Subject: ") - 9);
    let startIndex = msg.indexOf("UTF-8") + 10;
    let content = msg.substr(startIndex);
    let endIndex = content.indexOf("--");
    document.getElementById("preview_content").value = content.substr(0,endIndex);
}

function sendEmails() {
    sa.sendEmails(draftMessage, emailAddresses, {
        "name": names
    });
}