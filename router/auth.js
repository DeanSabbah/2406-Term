import { Router } from "express";
const router = Router();
import { readFile } from "fs";
import userModel from "../models/userModel.js";
import session from "express-session";

const db = await import("../db.js").then(module => module.default);
const usersCollection = db.collection("users");

router.use((req, res, next)=>{
    next();
});

async function checkPub(req, res){
    var user = await userModel.findById(req.session.uid).exec();
    return user.isPub;
}

function checkLogin(req, res){
    if(!req.session.loggedin){
        return false;
    }
    return true;
}

function logout(req, res, next) {
	if (req.session.loggedin) {
		req.session.loggedin = false;
        req.session.uid = undefined;
		res.status(200).send("Logged out.");
        return;
    }
	res.status(200).send("Logged out.");
}

async function login(req, res, next){
    try {
        if (req.session.loggedin) {
            res.status(200).send("Already logged in.");
            return;
        }
        var nameIn = '"'+req.body.username.replace(/\s/g, '"\\ \\"')+'"';
        var passIn = req.body.password;
        var user = await userModel.findOne({$text:{$search:nameIn}}).exec();
        if(user == null){
            res.body = "Incorrect username";
            res.status(401).end();
            return;
        }
        if(user.password != passIn){
            res.status(401).end("Incorrect password");
            return;
        }
        req.session.uid = user._id
        req.session.loggedin = true;
        res.status(200).end("Login successful");
    } catch (e) {
        res.status(500).end("Server error");
        console.error(e);
    }
}

async function togglePub(req, res, next){
    try{
        var user = await userModel.findById(req.session.uid).exec();
        user.isPub = !user.isPub;
        user.save();
        res.status(200).end()
    }
    catch(e){
        console.error(e);
        res.status(500).end("Server error");
    }
}

async function register(req, res, next){
    try {
        if (req.session.loggedin) {
            res.status(200).send("Already logged in.");
            return;
        }
        var nameIn = req.body.username;
        var passIn = req.body.password;
        var dob = Date.parse(req.body.dob);
        if(!dob){
            res.status(400).end("Please enter date of birth");
            return;
        }
        var q = await userModel.findOne({"name":nameIn}).exec();
        if(q != null){
            res.status(409).end("User already exists");
            return;
        }
        await userModel.create({"name":nameIn, password:passIn, dob:dob, isPub:false})
            .then(newInstance =>{
                console.log(newInstance);
            })
            .catch(err =>{
                res.status(500).end();
                throw err;
            });
        login(req, res)
        //res.status(200).end("UserCreated");
    } catch (e) {
        res.status(500).end("Server error");
        throw e;
    }
}

router.put("/togglePub", (togglePub));

router.get("/checkLogin", (req, res)=>{
    if(!checkLogin(req, res)){
        res.status(200).end('false')
        return;
    }
    res.status(200).end('true');
});

router.get("/checkPub",async (req, res)=>{
    if(!await checkPub(req, res)){
        res.status(200).end('false')
        return;
    }
    res.status(200).end('true');
});

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