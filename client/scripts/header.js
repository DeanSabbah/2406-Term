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
    document.getElementById("notifications").classList.toggle("show");
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/users/notificaiton");
    xhttp.send();
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
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/auth/checkLogin");
    xhttp.send();
    xhttp.onload = ()=>{
        if(xhttp.status == 200){
            document.getElementById("myProfile").removeAttribute("hidden");
            document.getElementById("logout").removeAttribute("hidden");
            document.getElementById("dropdown").removeAttribute("hidden")
            xhttp.open("GET", "/users/notificaiton");
            xhttp.send();
            xhttp.onload = ()=>{
                var dataIn = JSON.parse(xhttp.response);
                if (dataIn.notifications.length <= 0){
                    return;
                }
                var notifications = document.getElementById("notifications");
                notifications.innerHTML = "";
                var publishers = "";
                for(item in dataIn.notifications){
                    for(publisher in dataIn.notifications[item].publisher){
                        console.log(publisher)
                        publishers += dataIn.notifications[item].publisher[publisher];
                    }
                    notifications.innerHTML += `<a href="/games/${dataIn.notifications[item]._id}"> ${dataIn.notifications[item].name} by ${publishers}</a>`;
                }
            }
        }
    }
}