//keeps track of last returned item
var curStart = 0;
//ensure the get more function searches for the same thing as the original query
var searchText = "";
var searchType = 0;
var pubOnly = false;

//adds event listeners to submit the search request, get more results and display the publisher only option
function init(){
    document.getElementById("submit").addEventListener("click", (event)=>{
        event.preventDefault();
        search();
    });
    document.getElementById("getMore").addEventListener("click", (event)=>{
        getMore();
    });
    var select = document.getElementById("searchOption");
    select.addEventListener("change", ()=>{
        if(select.selectedIndex == 1){
            document.getElementById("pubOnly").classList.remove("hide");
            return;
        }
        document.getElementById("pubOnly").classList.add("hide");
    });
}

//Sends HTTPRequest with query containing the requests provided by the user, then diplays the first 10 results on the page
function search(){
    curStart = 10;
    document.getElementById("getMore").classList.add("hide");
    searchText = document.getElementById("searchText").value;
    searchType = document.getElementById("searchOption").selectedIndex;
    if(searchText == "" || searchText == null){
        alert("please enter a search term");
        return;
    }
    if(searchType){
        pubOnly = document.getElementById("pubOnlyCheck").checked;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", `search/query/?query=${searchText}&type=${searchType}&pubOnly=${pubOnly}`);
    xhttp.send();
    xhttp.onload = ()=>{
        var res = JSON.parse(xhttp.response);
        var resList = document.getElementById("resList");
        resList.innerHTML = "";
        for(item in res){
            if(!searchType){
                resList.innerHTML += `<li><a href="/games/${res[item]._id}">${res[item].name}</a></li>`
            }
            else{
                resList.innerHTML += `<li><a href="/users/${res[item]._id}">${res[item].name}</a></li>`
            }
        }
        if(res.length == 10){
            document.getElementById("getMore").classList.remove("hide");
        }
    }
}

//sends the same query with start pos to get next 10, until there are no more results
function getMore(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", `search/query/?query=${searchText}&type=${searchType}&pubOnly=${pubOnly}&startPos=${curStart}`);
    xhttp.send();
    xhttp.onload = ()=>{
        var res = JSON.parse(xhttp.response);
        var resList = document.getElementById("resList");
        for(item in res){
            if(!searchType){
                resList.innerHTML += `<li><a href="/games/${res[item]._id}">${res[item].name}</a></li>`
            }
            else{
                resList.innerHTML += `<li><a href="/users/${res[item]._id}">${res[item].name}</a></li>`
            }
        }
        if(res.length < 10){
            document.getElementById("getMore").classList.add("hide");
        }
        curStart += 10;
    }
}