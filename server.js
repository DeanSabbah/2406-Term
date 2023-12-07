import express from "express";
import session from 'express-session';
import { readFile } from "fs";
import cookieParser from "cookie-parser";

const app = express();
const secret = ['E4b5JBuO8AI0Lq3yzUn6'];

import gameRouter from "./router/games.js";
import userRouter from "./router/users.js";
import authRouter from "./router/auth.js";
import searchRouter from "./router/search.js"

//sets the root folder for all my pug templates and sets the template engine to pug
app.set("view engine", "pug");
app.set("views", "templates");

//adds default parsing capabilities
app.use(express.json());
//add cookie parsing capabilities
app.use(cookieParser(secret));

app.use(session({
	secret: secret,
	resave: false,
	saveUninitialized: false,
	cookie:{secure: false, httpOnly: true, signed: true}
}));

//logs incoming requests
app.use(function(req,res,next){
	console.log("Method: ", req.method);
	console.log("URL:    ", req.url);
	console.log("Path:   ", req.path);
	console.log("Cookies:	", req.cookies);
	console.log("Signed Cookies:	", req.signedCookies);
    console.log("username:  ", req.session.username);
	console.log("Query:	", req.query);
	next();
});

app.use("/games", gameRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/search", searchRouter);

app.get("/",(req, res)=>{
    //renders the landing/welcome/index page
    readFile("templates/pages/index.pug", (err, data)=>{
        if(err){
            res.status(500).end();
            return;
        }
        res.render("pages/index");
        res.status(200).end();
    });
});

app.get("/header.js", (req, res)=>{
    //sends js file for the header
	readFile("client/scripts/header.js", (err, data)=>{
		if(err){
            res.status(500).end();
            throw err;
		}
		res.status(200).end(data);
	});
});

app.get("/dropdown.css", (req, res)=>{
    //sends js file for the header
	readFile("client/styles/dropdown.css", (err, data)=>{
		if(err){
            res.status(500).end();
            throw err;
		}
		res.status(200).end(data);
	});
});

app.use((req, res)=>{
    res.body = "Resource not found";
    res.status(404).render("pages/error", {res:res});
    res.end();
});

	
app.listen(3000);
console.log("Server running on Port 3000");