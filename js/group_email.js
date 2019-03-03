let sa = new SheetsApi();
sa.setKeys("1n2w0s1lqSZ4kHX3zeNYT-UNRPEr1aextWaG_bsJisn8", "AIzaSyDeampVGzzd8NvBiUtEsNVmNkAQU1TZ17I", "21358841826-edt9rotek8r1rbivt91nabpn2sc2g6ts.apps.googleusercontent.com");
sa.handleClientLoad();

let sheetHeaders;
let criteriaIndex = 1;

function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        sa.getTableHeaders("UPLS").then(res => {
            sheetHeaders = sa.parseTableHeaders(res);
            addCriteria();
        });
    } else {
        console.log("Need Log In!");
        sa.handleSignInClick();
    }
}

function addCriteria() {
    let options = "";
    for (let i = 0; i < sheetHeaders.length; i++) {
        options += "<option>" + sheetHeaders[i] + "</option>";
    }
    let str = "<div id=\"creteria_" + criteriaIndex + "\">\n" +
        "<table>\n" +
        "<tr>\n" +
        "<td><button class=\"close_button\" onclick=\"deleteCriteria(this)\"></button></td>\n" +
        "<td><label for=\"select_criteria_" + criteriaIndex + "\">Criteria: </label></td>\n" +
        "<td><select id=\"select_criteria_" + criteriaIndex + "\" onchange=\"getVocabulary(this.value," + criteriaIndex + ")\">" + options + "</select></td>\n" +
        "</tr>\n" +
        "<tr>\n" +
        "<td></td>\n" +
        "<td><label for=\"select_values_" + criteriaIndex + "\">Values:</label></td>\n" +
        "<td><select id=\"select_values_" + criteriaIndex + "\" onchange=\"updatePopulation(this.value," + criteriaIndex + ")\"></select></td>\n" +
        "</tr>\n" +
        "</table>\n" +
        "</div>";
    document.getElementById("criteria").innerHTML += str;

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

let resultGroup;
function updatePopulation(value, index) {
    let header = document.getElementById("select_criteria_" + index).value;
    sa.getSheet("UPLS").then(res => {
        resultGroup = sa.selectFromTableWhereConditions(res, "*", [{
            "header":header, "value": value}], 1);
        document.getElementById("number_label").innerHTML = "This group currently contains " + (resultGroup.length - 1) + " people.";
    });
}