const express = require("express");
const app = express();
const fs = require("fs");
const { MongoClient, ObjectId } = require("mongodb");

const gameRouter = require("./router/games.js");
const userRouter = require("./router/users.js");

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

app.use("/games", gameRouter);
app.use("/users", userRouter);

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

// Create a new client and connect to MongoDB
const client = new MongoClient("mongodb://127.0.0.1:27017/");
let db = client.db("term");
const gamesCollection = db.collection("games");

async function run() {
	try {
	} finally {		
		app.listen(3000);
		console.log("Server running on Port 3000");
	}
}
// Run the function and handle any errors
run().catch(console.dir);