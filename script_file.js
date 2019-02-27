let array = [];


function toArray() {
    let inputVal = document.getElementsByName("addStudent").value;
    if(inputVal != null) {
        array.push(inputVal);
        return false;
    }
    console.log(array);
}