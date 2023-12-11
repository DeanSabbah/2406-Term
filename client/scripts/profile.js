var userId;

async function init(uid){
    showData(event, "games");
    userId = uid;
    if(await logInCheck()){
        checkFollowing();
        if(await pubCheck()){
            document.getElementById("postGame").hidden = false;
        }
    }
    else{
        document.getElementById("followButton").disabled = true;
    }
}


function showData(evt, dataType) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(dataType).style.display = "block";
    evt.currentTarget.className += " active";
}

function removeLike(gameId){
    var xhttp = new XMLHttpRequest()
    xhttp.open("DELETE", "/games/like");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({gid:gameId}));
    xhttp.onload = ()=>{
        if(xhttp.status == 200){
            location.reload();
        }
    }
}

function removeReview(gameId, revId){
    var xhttp = new XMLHttpRequest()
    xhttp.open("DELETE", "/games/review");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({gid:gameId, rid:revId}));
    xhttp.onload = ()=>{
        if(xhttp.status == 200){
            location.reload();
        }
    }
}

function checkFollowing(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/users/checkFollowing");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({uid:userId}));
    xhttp.onload = ()=>{
        if(xhttp.responseText === "true"){
            document.getElementById("followButton").setAttribute("onclick", "unfollow()");
            document.getElementById("followButton").innerText = "Following";
        }
    }
}

function follow(){
    var xhttp = new XMLHttpRequest()
    xhttp.open("PUT", "follow");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({uid:userId}));
    xhttp.onload = ()=>{
        if(xhttp.status == 200){
            location.reload();
        }
    }
}
function unfollow(){
    var xhttp = new XMLHttpRequest()
    xhttp.open("DELETE", "follow");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({uid:userId}));
    xhttp.onload = ()=>{
        if(xhttp.status == 200){
            location.reload();
        }
    }
}

async function togglePub(){
    if(await logInCheck()){
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/auth/togglePub");
        xhttp.send();
        xhttp.onload = ()=>{
            if(xhttp.status == 200){
                location.reload();
            }
        }
    }
}