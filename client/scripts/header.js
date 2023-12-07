function init_header(){
    logInCheck();
}

function logout(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/auth/logout");
    xhttp.send();
    xhttp.onload = ()=>{
        alert(xhttp.responseText);
        if(xhttp.status == 200){
            location.reload();
        }
    }
}
function showNotification() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function logInCheck(){
    if(document.cookie.includes("loggedIn=true")){
        document.getElementById("myProfile").removeAttribute("hidden");
        document.getElementById("logout").removeAttribute("hidden");
    }
}