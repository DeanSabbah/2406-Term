//adds event listener to the new workshop form
function init(){
    document.getElementById("form").addEventListener("submit", formSubmit);
}

//sends an HTTPRequest to post a new workshop. If successful, the user is redirected to the new workshop's page
function formSubmit(event) {
    event.preventDefault();
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', "newWorkshop");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onload = ()=>{
        if(xhttp.status == 200){
            window.open(`/workshops/${JSON.parse(xhttp.response).id}`, "_self");
        }
        else{
            alert(xhttp.responseText);
        }
    }
    var workshop = {};
    new FormData(event.target).forEach((value, key) =>{
        workshop[key] = value;
    });
    xhttp.send(JSON.stringify(workshop));
}