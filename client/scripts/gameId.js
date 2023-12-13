var gameId;
var userId;
//saves the games ID and the publisher's ID to use in check, then calls those checks
async function init(gid, uid){
    gameId = gid;
    userId = uid;
    if(await logInCheck()){
        checkLiked();
        checkFollowing();
        isOwn();
    }
    //if the user isn't logged in, all elements that require beinglogged in are hidden
    else{
        document.getElementById("followButton").disabled = true;
        document.getElementById("reviewText").disabled = true;
        document.getElementById("reviewText").setAttribute("placeholder", "Log in to post a comment");
        document.getElementById("reviewSubmit").disabled = true;
    }
}

//checks if the user has liked the game, if true, the like button is changed and now links to the dislike funtion
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

//Checks if the user if following the publisher. If true, the follow button is changed and links to the unfollow function
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

//checks if the game was published by the user. If true, all butons related to liking/leaving a review are disabled
function isOwn(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/users/isOwn");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({gid:gameId}));
    xhttp.onload = ()=>{
        if(xhttp.responseText === "true"){
            document.getElementById("followButton").hidden = true;
            document.getElementById("likeButton").hidden = true;
            document.getElementById("followButton").disabled = true;
            document.getElementById("reviewText").disabled = true;
            document.getElementById("reviewText").setAttribute("placeholder", "Cannot review own game");
            document.getElementById("reviewSubmit").disabled = true;
        }
    }
}

//Sends an HTTPRequest to follow the publisher
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

//Sends an HTTPRequest to unfollow the publisher
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

//Sends an HTTPRequest to like the game
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

//Sends an HTTPRequest to unlike the game
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
////Sends an HTTPRequest to post a review
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