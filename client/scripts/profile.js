var userId;

//saves the user's ID to use in check, then calls those checks 
async function init(uid){
    showData(event, "games");
    userId = uid;
    //checks if user is logged in, if not then the follow button is disabled
    if(await logInCheck()){
        checkFollowing();
        //if the user is a publisher, publisher only elements are displayed
        if(await pubCheck()){
            document.getElementById("postGame").hidden = false;
            document.getElementById("postWorkshop").hidden = false;
        }
    }
    else{
        document.getElementById("followButton").disabled = true;
    }
}

//Show data for tab that was clicked. Tab functionality and styles were taken from W3Schools Source:https://www.w3schools.com/howto/howto_js_tabs.asp
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

//Sends HTTPRequest to delete like on selected game
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

//Sends HTTPRequest to delete review on selected game
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

//checks if the user is following the page's owner. If true, the follow button is changed to a following button and links to unfollow function
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

//Sends HTTPRequest to follow page's owner
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

//Sends HTTPRequest to unfollow page's owner
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

//Sends HTTPRequest to unfollow selected user
function unfollowOther(uid){
    var xhttp = new XMLHttpRequest()
    xhttp.open("DELETE", "follow");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({uid:uid}));
    xhttp.onload = ()=>{
        if(xhttp.status == 200){
            location.reload();
        }
    }
}

//Sends HTTPRequest to change the user's publisher status
async function togglePub(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/auth/togglePub");
    xhttp.send();
    xhttp.onload = ()=>{
        if(xhttp.status == 200){
            console.log(xhttp.responseText);
            if(xhttp.responseText == "newPub"){
                window.open("/games/NewGame", "_self");
                return;
            }
            location.reload();
        }
    }
}

//Sends HTTP request to enroll in selected workshop
function enroll(wid){
    var xhttp = new XMLHttpRequest()
    xhttp.open("PUT", "/workshops/enroll");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({wid:wid}));
    xhttp.onload = ()=>{
        if(xhttp.status == 200){
            alert("Enrollment successful!");
            location.reload();
        }
    }
}