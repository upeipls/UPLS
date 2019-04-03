var errors = [];
var emailErrors = JSON.parse(window.localStorage.getItem("emailErrors"));
var idErrors = JSON.parse(window.localStorage.getItem("idErrors"));
var progErrors = JSON.parse(window.localStorage.getItem("progErrors"));
var cataErrors = JSON.parse(window.localStorage.getItem("cataErrors"));
var dupeIdErrors = JSON.parse(window.localStorage.getItem("dupeIdErrors"));


function createTable(tableData) {
    var table = document.createElement('table');
    table.style.border = "solid";
    var row = {};
    var cell = {};

    tableData.forEach(function(rowData) {
        row = table.insertRow(-1);
        rowData.forEach(function(cellData) {
            cell = row.insertCell();
            cell.textContent = cellData;
            cell.style.border = "solid";
        });
    });
    document.body.appendChild(table);
}

function createProgTable(tableData) {
    var table = document.createElement('table');
    table.style.border = "solid";
    var row = {};
    var cell = {};
    var count = 1;
    tableData.forEach(function(rowData) {
        row = table.insertRow(-1);
        rowData.forEach(function(cellData) {
            cell = row.insertCell();
            cell.textContent = cellData;
            cell.style.border = "solid";
        });
        if(!rowData.includes("STUDENT_ID")) {
            var button = row.insertCell(-1);
            button.innerHTML = '<button>Add</button>';
            button.setAttribute("id", "btn" + count);
            button.addEventListener("click", function() {
                console.log(rowData[6] + rowData[12]);
                window.localStorage.setItem("progDesc",JSON.stringify(rowData[6]));
                window.localStorage.setItem("librarian",JSON.stringify(rowData[12]));
                window.open("add_program_description.html", "_blank");
            });
            count++;
        }
    });
    document.body.appendChild(table);
}