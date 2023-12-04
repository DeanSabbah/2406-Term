import express from "express";
const app = express();
import { readFile } from "fs";

import gameRouter from "./router/games.js";
import userRouter from "./router/users.js";
import authRouter from "./router/auth.js";

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
app.use("/auth", authRouter);

app.get("/",(req, res)=>{
    //sends the landing/welcome page file
    readFile("templates/pages/welcome.pug", function(err, data){
        if(err){
            res.status(500).end();
            return;
        }
        res.render("pages/welcome");
        res.status(200).end();
    });
});

app.use((req, res)=>{
    res.body = "Resource not found"
    res.status(404).render("pages/error", {res:res});
    res.end();
});

async function run() {
	try {
	} finally {		
		app.listen(3000);
		console.log("Server running on Port 3000");
	}
}
// Run the function and handle any errors
run().catch(console.dir);