import { Router } from "express";
const router = Router();
import { readFile } from "fs";
import { ObjectId } from "mongodb";
const db = await import("../db.js").then(module => module.default);
import gameModel from "../models/gameModel.js";
import userModel from "../models/userModel.js";
import reviewModel from "../models/reviewModel.js";

const usersCollection = db.collection("users");
const gamesCollection = db.collection("games");
const reviewsCollection = db.collection("reviews");

router.get("/profile.css", (req, res)=>{
    readFile("./client/styles/profile.css", (err, data)=>{
        if(err){
            res.status(500).end("Server error");
            return;
        }
        res.status(200).end(data);
    });
});

router.get("/profileTab.css", (req, res)=>{
    readFile("./client/styles/profileTab.css", (err, data)=>{
        if(err){
            res.status(500).end("Server error");
            return;
        }
        res.status(200).end(data);
    });
});

router.get("/profile.js", (req, res)=>{
    readFile("./client/scripts/profile.js", (err, data)=>{
        if(err){
            res.status(500).end("Server error");
            return;
        }
        res.status(200).end(data);
    });
});

router.route("/myProfile")
    .get(async (req, res)=>{
        var username = req.session.username;
        if(username == undefined){
            res.status(401).end("not logged in");
            return;
        }
        var user = await usersCollection.findOne({$text:{$search:username}});
        if(user == null){
            res.status(500).end("Server error");
            return;
        }
        res.render("pages/profiles/userPage",{user:user});
        res.status(200).end();
    });

router.get("/:uid/data", async (req, res)=>{
    var user = await usersCollection.findOne({"_id":new ObjectId(req.params.uid)});
    if(user == null){
        res.body = "user not found";
        res.status(404).render("pages/error",{res:res})
        end();
        return;
    }
    var data = {likes:[],reviews:[]};
    if(user.likes != undefined && user.likes.length != 0){
        var querry = [];
        for(let i = 0; i < user.likes.length; i++){
            console.log(user.likes[i]);
            querry[i] = new ObjectId(user.likes[i]);
        }
        let likes = await gamesCollection.find({_id:{$all:querry}})
            .toArray();
        data.likes = likes;
    }
    else{
        data.likes = undefined;
    }
    if(user.reviews != undefined && user.reviews.length != 0){
        var querry = [];
        for(let i = 0; i < user.reviews.length; i++){
            console.log(user.reviews[i]);
            querry[i] = new ObjectId(user.reviews[i]);
        }
        let reviews = await reviewsCollection.find({_id:{$all:querry}})
            .toArray();
        data.reviews = reviews;
    }
    else{
        data.reviews = undefined;
    }
    res.status(200).json(data).end();
});

router.route("/:uid")
    .get(async (req, res)=>{
        var user = await usersCollection.findOne({"_id":new ObjectId(req.params.uid)});
        if(user == null){
            res.body = "user not found";
            res.status(404).render("pages/error",{res:res})
            res.end();
            return;
        }
        console.log(user);
        res.format({
            html: ()=>{
                res.render("pages/profiles/userPage",{user:user});
            },
            json: ()=>{
                res.json(user);
            }
        });
        res.status(200).end();
    })

export default router;