const express = require("express");
const app = express();
const fs = require("fs");
const mongo = require("mongodb");
const mc = require("mongodb").MongoClient;

//sets the root folder for all my pug templates and sets the template engine to pug
app.set("view engine", "pug");
app.set("views", "templates");

//logs incoming requests
app.use(function(req,res,next){
	console.log("Method: ", req.method);
	console.log("URL:    ", req.url);
	console.log("Path:   ", req.path);
	next();
});

app.get("/",(req, res)=>{
    //sends the landing/welcome page file
    fs.readFile("templates/pages/welcome.pug", function(err, data){
        if(err){
            res.status(500).end();
            return;
        }
        res.render("pages/welcome");
        res.status(200).end();
    });
});

app.get("/gameId.js", (req, res)=>{
    fs.readFile("client/scripts/gameId.js", (err, data)=>{
        if(err){
            console.log("??????????2")
            res.status(500).end("internal server error");
            return;
        }
        res.status(200).end(data);
    })
});

mc.connect("mongodb://127.0.0.1:27017", function(err, client) {
	if (err) {
		console.log("Error in connecting to database");
		console.log(err);
		return;
	}
	
	//Set the app.locals.db variale to be the 'data' database
	db = client.db("term");
	app.listen(3000);
	console.log("Server listening on port 3000");
})
//console.log("server listening on port 3000");