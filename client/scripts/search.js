function init(){
    document.getElementById("submit").addEventListener("click", (event)=>{
        event.preventDefault();
        search();
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
    var searchText = document.getElementById("searchText").value;
    var searchType = document.getElementById("searchOption").selectedIndex;
    var pubOnly = false;
    if(searchText == "" || searchText == null){
        alert("please enter a search term");
        return;
    }
    if(searchType == 1){
        pubOnly = document.getElementById("pubOnlyCheck").checked;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.open("post", `search/?query="${searchText}&type=${searchType}&pubOnly=${pubOnly}"`);
    xhttp.send();
    xhttp.onload = ()=>{

    }
}