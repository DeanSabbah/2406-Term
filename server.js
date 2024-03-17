import express from "express";
import session from 'cookie-session';
await import("./db.js").then(module => module.default);
import { readFile } from "fs";

const app = express();
const secret = ['E4b5JBuO8AI0Lq3yzUn6'];

import gameRouter from "./router/games.js";
import userRouter from "./router/users.js";
import authRouter from "./router/auth.js";
import searchRouter from "./router/search.js"
import workshopRouter from "./router/workshops.js"

//sets the root folder for all my pug templates and sets the template engine to pug
app.set("view engine", "pug");
app.set("views", "templates");

//adds default parsing capabilities
app.use(express.json());

//Creates session token for user
app.use(session({
	keys: secret,
	resave: false,
	saveUninitialized: false,
	cookie:{secure: false, httpOnly: true, signed: true}
}));

//logs incoming requests
app.use((req,res,next)=>{
	console.log("--------------------------------------");
	console.log("Method: ", req.method);
	console.log("URL:    ", req.url);
	console.log("Path:   ", req.path);
    console.log("ID:	 ", req.session.uid);
	console.log("Query:	 ", req.query);
	console.log("Time:	 ", new Date().toLocaleString());
	next();
});

//assigns routes to routers
app.use("/games", gameRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/search", searchRouter);
app.use("/workshops", workshopRouter);

//renders welcome page
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

//sends scripts for header
app.get("/header.js", (req, res)=>{
	readFile("client/scripts/header.js", (err, data)=>{
		if(err){
            res.status(500).end();
            throw err;
		}
		res.status(200).end(data);
	});
});

//sends css for dropdown. Drop down tab styles and functionality were taken from W3School Source:  https://www.w3schools.com/howto/howto_js_dropdown.asp
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

//sends css for the header (and base css for the entire site)
app.get("/styles.css", (req, res)=>{
	readFile("client/styles/styles.css", (err, data)=>{
		if(err){
            res.status(500).end();
            throw err;
		}
		res.status(200).end(data);
	});
});

//404 bad URL handling
app.use((req, res)=>{
    res.body = "Resource not found";
    res.status(404).render("pages/error", {res:res});
    res.end();
});

app.listen(10000);
console.log("Server running on Port 10000");