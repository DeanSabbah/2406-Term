import { Router } from "express";
const router = Router();
import { readFile } from "fs";
import userModel from "../models/userModel.js";
import publisherModel from "../models/publisherModel.js";

const db = await import("../db.js").then(module => module.default);
const usersCollection = db.collection("users");

router.use((req, res, next)=>{
    next();
});

function logout(req, res, next) {
	if (req.session.loggedin) {
		req.session.loggedin = false;
        res.clearCookie(req.session.username);
		req.session.username = undefined;
		res.status(200).send("Logged out.");
	} else {
		res.status(400).send("You must be logged in to log out");
	}
}

async function auth(req, res, next){
	if(user.isPub && req.session.loggedin){
		next();
	}
	else{
		res.status(401).end("unauthorized");
	}
}

async function login(req, res, next){
	if (req.session.loggedin) {
		res.status(200).send("Already logged in.");
		return;
	}
    var nameIn = req.body.username;
    var passIn = req.body.password;
    var user = await usersCollection.findOne({$text:{$search:nameIn}});
    console.log(user);
    if(user == null){
        res.body = "Incorrect username";
        res.status(401).end();
        return;
    }
    if(user.password != passIn){
		res.status(401).end("Incorrect password");
        return;
    }
    req.session.username = nameIn;
    req.session.loggedin = true;
    res.cookie(user.name, user.password, {httpOnly: true, secure: false, signed: true});
    res.status(200).end("Login successful");
}

async function register(req, res, next){
	if (req.session.loggedin) {
		res.status(200).send("Already logged in.");
		return;
	}
    var nameIn = req.body.username;
    var passIn = req.body.password;
    var q = await userModel.findOne({"name":nameIn})
        .catch(err =>{
            res.status(500).end("Server error");
            throw err;
        });
    if(q != null){
        res.status(401).end("User already exists");
        return;
    }
    var dob = Date.parse(req.body.dob);
    await userModel.create({"name":nameIn, password:passIn, dob:dob})
        .then(newInstance =>{
            console.log(newInstance);
        })
        .catch(err =>{
            res.status(500).end();
            throw err;
        });
    res.status(200).end("UserCreated");
}

router.route("/register")
    .get((req, res)=>{
        //sends the register page
        readFile("templates/pages/auth/register.pug", function(err, data){
            if(err){
                res.status(500).end();
                return;
            }
            res.render("pages/auth/register");
            res.status(200).end();
        });
    })
    .post(register);

router.route("/login")
    .get((req, res)=>{
        //sends the login page
        readFile("templates/pages/auth/login.pug", function(err, data){
            if(err){
                res.status(500).end();
                return;
            }
            res.render("pages/auth/login");
            res.status(200).end();
        });
    })
    .post(login);

router.get("/logout", (logout));

router.get("/login.js", (req, res)=>{
    readFile("./client/scripts/login.js", (err, data)=>{
        if(err){
            res.status(500).end();
            return;
        }
        res.status(200).end(data);
    });
});

router.get("/register.js", (req, res)=>{
    readFile("./client/scripts/register.js", (err, data)=>{
        if(err){
            res.status(500).end();
            return;
        }
        res.status(200).end(data);
    });
});

export default router;