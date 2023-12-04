import { Router } from "express";
const router = Router();
import { readFile } from "fs";
const db = await import("../db.js").then(module => module.default);

const usersCollection = db.collection("users");


router.use((req, res, next)=>{
    next();
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
    .post(async (req, res)=>{
        var userIn = req.body;
    });

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
    .post(async (req, res)=>{
        var userIn = req.body;
        var q = await usersCollection.find({"name":userIn.name})
            .toArray();
        if(q.length < 1){
            res.body("User not found");
            res.status(400).end();
            return;
        }
        if(q[0].password == userIn.password){
            res.status(200).end();
        }
    });

export default router;