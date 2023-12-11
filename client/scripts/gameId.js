var gameId;
var userId;

async function init(gid, uid){
    gameId = gid;
    userId = uid;
    if(await logInCheck()){
        checkLiked();
        checkFollowing();
        isOwn();
    }
    else{
        document.getElementById("followButton").disabled = true;
        document.getElementById("reviewText").disabled = true;
        document.getElementById("reviewText").setAttribute("placeholder", "Log in to post a comment");
        document.getElementById("reviewSubmit").disabled = true;
    }
}

function checkLiked(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/users/checkLiked");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({gid:gameId}));
    xhttp.onload = ()=>{
        if(xhttp.responseText === "true"){
            document.getElementById("likeButton").setAttribute("onclick", "removeLike()")
            document.getElementById("likeButton").classList.add("liked");
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

function isOwn(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/users/isOwn");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({gid:gameId}));
    xhttp.onload = ()=>{
        if(xhttp.responseText === "true"){
            document.getElementById("followButton").hidden = true;
            document.getElementById("likeButton").hidden = true;
        }
    }
}

function follow(){
    var xhttp = new XMLHttpRequest()
    xhttp.open("PUT", "/users/follow");
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
    xhttp.open("DELETE", "/users/follow");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({uid:userId}));
    xhttp.onload = ()=>{
        if(xhttp.status == 200){
            location.reload();
        }
    }
}
async function addLike(){
    if(!await logInCheck()){
        alert("Please log in to like this game");
        return;
    }
    var xhttp = new XMLHttpRequest()
    xhttp.open("PUT", "like");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({gid:gameId}));
    xhttp.onload = ()=>{
        if(xhttp.status == 200){
            location.reload();
        }
    }
}
function removeLike(){
    var xhttp = new XMLHttpRequest()
    xhttp.open("DELETE", "like");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({gid:gameId}));
    xhttp.onload = ()=>{
        if(xhttp.status == 200){
            location.reload();
        }
    }
}

function postReview(){
    var rating = document.getElementById("rating").valueAsNumber;
    console.log(rating);
    var text= document.getElementById("reviewText").value;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "review");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({gid:gameId, rating:rating, text:text}));
    xhttp.onload = ()=>{
        if(xhttp.status == 200){
            location.reload();
        }
    }
}