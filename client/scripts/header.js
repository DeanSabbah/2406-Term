var uid;

//Checks if the user is logged. If true, calls the showElms function
async function init_header(){
    if(await logInCheck()){
        showElms()
    }
}

//Sends and HTTPRequest to log the user out
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

//displayes the notification tray, then sends an XHTTP request to delete the notifications. Drop down tab styles and functionality were taken from W3School Source:  https://www.w3schools.com/howto/howto_js_dropdown.asp
function showNotification() {
    document.getElementById("notifications").classList.toggle("show");
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/users/notificaiton");
    xhttp.send();
}

// Close the dropdown menu if the user clicks outside of it. Drop down tab styles and functionality were taken from W3School Source:  https://www.w3schools.com/howto/howto_js_dropdown.asp
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

//Displays elements that are only availiable to users and populates the notificaiton tray if there are new notificaitons.
function showElms(){
    document.getElementById("myProfile").removeAttribute("hidden");
    document.getElementById("myProfile").setAttribute("href", `/users/${uid}`);
    document.getElementById("logout").removeAttribute("hidden");
    document.getElementById("dropButton").removeAttribute("hidden");
    document.getElementById("register").hidden = true;
    document.getElementById("login").hidden = true;
    document.getElementById("right").classList.add("alt");
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/users/notificaiton");
    xhttp.send();
    xhttp.onload = ()=>{
        var dataIn = JSON.parse(xhttp.response);
        if (dataIn.notifications.length <= 0){
            return;
        }
        var notifications = document.getElementById("notifications");
        var badge = document.createElement("span");
        badge.classList.add("badge");
        notifications.innerHTML = "";
        var badgeNum = 0;
        for(item in dataIn.notifications){
            badgeNum++;
            document.getElementById("dropdown").appendChild(badge);
            console.log(dataIn.notifications);
            if(dataIn.notifications[item].docModel == "Game"){
                notifications.innerHTML += `<a href="/games/${dataIn.notifications[item].doc._id}"> ${dataIn.notifications[item].doc.name} by ${dataIn.notifications[item].doc.publisher[0]}</a>`;
            }
            else{
                notifications.innerHTML += `<a href="/workshops/${dataIn.notifications[item].doc._id}"> ${dataIn.notifications[item].doc.name} by ${dataIn.notifications[item].doc.publisher[0]}</a>`;
            }
        }
        badge.innerText = badgeNum;
    }
}

//Sends HTTPRequest to check if the user is logged in (availiable to all other client side js scripts because all other pages have a header)
async function logInCheck(){
    return new Promise((resolve, reject)=>{
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/auth/checkLogin");
        xhttp.onload = ()=>{
            var res = JSON.parse(xhttp.response);
            uid = res.uid;
            resolve(res.res === "true");
        }
        xhttp.onerror = ()=>{
            reject(xhttp.status);
        }
    xhttp.send()
    })
}

//Sends HTTPRequest to check if the user is a publisher (availiable to all other client side js scripts because all other pages have a header)
async function pubCheck(){
    return new Promise((resolve, reject)=>{
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/auth/checkPub");
        xhttp.onload = ()=>{
            resolve(xhttp.responseText === "true");
        }
        xhttp.onerror = ()=>{
            reject(xhttp.status);
        }
    xhttp.send()
    })
}