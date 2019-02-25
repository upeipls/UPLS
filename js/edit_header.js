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
    let str = "<tr><th>Column Name</th><th>Data Type</th><th>Vocabulary</th><th>Operation</th></tr>";
    sa.getTableHeaders(sheetName).then(response => {
        sheetHeaders = sa.parseTableHeaders(response);
        for (let i = 0; i < sheetHeaders.length; i++) {
           str += "<tr><td>" + sheetHeaders[i] + "</td><td>-</td><td>-</td><td><button class='borderless-btn' onclick='editHeaderCard(this)'><i class='fas fa-pen'></i></button></td></tr>";
        }
        str += "<tr><td>/</td><td>-</td><td>-</td><td><button class='borderless-btn' onclick='addNewHeader()'><i class='fas fa-plus'></i></button></td></tr>";
        document.getElementById("headers_table").innerHTML = str;
    });
}

function addNewHeader() {
    document.getElementById("add-card").classList.remove("invisible");
    blurContent();
}

function addHeader() {
    let headerName = document.getElementById("new-header-name").value;
    let headerType = document.getElementById("new-header-type").value;
    let vocabulary = document.getElementById("new-vocabulary").value;
    console.log(headerName + ":" + headerType);
    console.log(vocabulary);
    sa.getTableHeaders(sheetName).then(response => {
        sa.alterTableAddCol(sheetName, [headerName], sa.parseTableHeaders(response).length).then(response => {
            console.log(sa.parseAlter(response));
            loadHeaders();
            closeCard();
        });
    });
}

function closeCard() {
    document.getElementById("new-header-name").value = "";
    document.getElementById("new-vocabulary").value = "";
    document.getElementById("add-card").classList.add("invisible");
    document.getElementById("edit-card").classList.add("invisible");
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
    notation = sa.getNotationFromColName(sheetHeaders, columnName) + "1";
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
    document.getElementById("content").classList.remove("remove-blur");
    document.getElementById("content").classList.add("blur");
}
