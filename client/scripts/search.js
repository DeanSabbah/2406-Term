var curStart = 0;

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

function search(){
    curStart = 10;
    document.getElementById("getMore").classList.add("hide");
    var searchText = document.getElementById("searchText").value;
    var searchType = document.getElementById("searchOption").selectedIndex;
    var pubOnly = false;
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

function getMore(){
    var searchText = document.getElementById("searchText").value;
    var searchType = document.getElementById("searchOption").selectedIndex;
    var pubOnly = false;
    if(searchType){
        pubOnly = document.getElementById("pubOnlyCheck").checked;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", `search/query/?query=${searchText}&type=${searchType}&pubOnly=${pubOnly}&startPos=${curStart}`);
    xhttp.send();
    xhttp.onload = ()=>{
        var res = JSON.parse(xhttp.response);
        console.log(searchType);
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