var workId;

//Saves the workshop ID to use in checks, then call those chacks
async function init(wid){
	workId = wid;
	//disables the enroll button if not logged in
	if(await logInCheck()){
		isOwn();
		checkEnrolled();
	}
	else{
		document.getElementById("enroll").disabled = true;
	}
}

//Sends HTTPRequest to check if the workshop is the user's. If true, the enroll button is hidden
function isOwn(){
	var xhttp = new XMLHttpRequest();
	xhttp.open("PUT", "/workshops/isOwn");
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(JSON.stringify({wid:workId}));
	xhttp.onload = ()=>{
		if(xhttp.responseText === "true"){
			document.getElementById("enroll").hidden = true;
		}
	}
}

//Sends HTTPRequest to check if the user is enrolled in the workshop. If true, the enroll changed to an enrolled button and links to the unenroll funciton
function checkEnrolled(){
	var xhttp = new XMLHttpRequest();
	xhttp.open("PUT", "/workshops/checkEnrolled");
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(JSON.stringify({wid:workId}));
	xhttp.onload = ()=>{
		if(xhttp.responseText === "true"){
			document.getElementById("enroll").setAttribute("onclick", "unEnroll()");
			document.getElementById("enroll").innerText = "Enrolled";
		}
	}
}

//Sends HTTPRequest to enroll the user into the workshop
function enroll(){
	var xhttp = new XMLHttpRequest()
	xhttp.open("PUT", "enroll");
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(JSON.stringify({wid:workId}));
	xhttp.onload = ()=>{
		if(xhttp.status == 200){
			location.reload();
		}
		else{
			alert(xhttp.responseText);
		}
	}
}

//Sends HTTPRequest to unenroll the user from the workshop
function unEnroll(){
	var xhttp = new XMLHttpRequest()
	xhttp.open("DELETE", "enroll");
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(JSON.stringify({wid:workId}));
	xhttp.onload = ()=>{
		if(xhttp.status == 200){
			location.reload();
		}
	}
}