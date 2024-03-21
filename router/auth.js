import { Router } from "express";
const router = Router();
import { readFile } from "fs";
import userModel from "../models/userModel.js";

//returns true if the user is a publisher (and logged in)
async function checkPub(req, res){
    if(!req.session.loggedin || !req.session.uid){
        res.status(401).end("Not logged in");
    }
    try{
        var user = await userModel.findById(req.session.uid).exec();
        return user.isPub;
    }
    catch(e){
        console.error(e);
        res.status(500).end();
    }
}

//returns true if the user is logged in
function checkLogin(req, res){
    if(!req.session.loggedin || !req.session.uid){
        return false;
    }
    return true;
}

//logs the user out
function logout(req, res, next) {
	if (req.session.loggedin) {
		req.session.loggedin = false;
        req.session.uid = undefined;
		res.status(200).send("Logged out.");
        return;
    }
	res.status(200).send("Logged out.");
}

//logs the user in, if the profile exists and passwords match
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

//changes the user's publisher status
async function togglePub(req, res, next){
    try{
        var user = await userModel.findById(req.session.uid).exec();
        if(user.games.length < 1){
            res.status(200).end("newPub");
            return;
        }
        user.isPub = !user.isPub;
        user.save();
        res.status(200).end()
    }
    catch(e){
        console.error(e);
        res.status(500).end("Server error");
    }
}

//registers a new profile if the username is unique and all properties are filled
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
        var q = await userModel.findOne({$text:{$search:nameIn}}).exec();
        if(q != null){
            res.status(409).end("User already exists");
            return;
        }
        await userModel.create({_id:nameIn, name:nameIn, password:passIn, dob:dob, isPub:false})
            .then(newInstance =>{
                console.log(newInstance);
            })
            .catch(err =>{
                res.status(500).end();
                throw err;
            });
        login(req, res);
        //res.status(200).end("UserCreated");
    } catch (e) {
        res.status(500).end("Server error");
        throw e;
    }
}

//route for toggling publisher
router.put("/togglePub", (togglePub));

//route for log in check
router.get("/checkLogin", (req, res)=>{
    if(!checkLogin(req, res)){
        var data = {res:"false", uid:undefined};
        res.json(data);
        res.status(200).end();
        return;
    }
    var data = {res:"true", uid:req.session.uid};
    res.json(data);
    res.status(200).end();
});

//route for publisher check
router.get("/checkPub",async (req, res)=>{
    if(!await checkPub(req, res)){
        res.status(200).end('false')
        return;
    }
    res.status(200).end('true');
});

//route for registration
router.route("/register")
    //displays register form
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

//route for logging in
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

//route for logging out
    router.get("/logout", (logout));

//sends login form's js script
router.get("/login.js", (req, res)=>{
    readFile("./client/scripts/login.js", (err, data)=>{
        if(err){
            res.status(500).end();
            return;
        }
        res.status(200).end(data);
    });
});

//sends register form's js script
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