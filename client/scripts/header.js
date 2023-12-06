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