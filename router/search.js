import { Router } from "express";
const router = Router();
import { readFile } from "fs";
import { ObjectId } from "mongodb";
const db = await import("../db.js").then(module => module.default);
import gameModel from "../models/gameModel.js";
import userModel from "../models/userModel.js";

const usersCollection = db.collection("users");
const gamesCollection = db.collection("games");
const max = 10;

router.get("/", (req, res)=>{
    res.status(200).render("pages/search");
    res.end();
});

router.get("/query", async (req, res)=>{
    var term = '"'+req.query.query.replace(/\s/g, '"\\ \\"')+'"';
    console.log(term);
    var type = parseInt(req.query.type);
    var publOnly = (req.query.pubOnly === "true");
    var start = 0;
    if(req.query.startPos){
        start = parseInt(req.query.startPos);
    }
    if(!type){
        var query = await gamesCollection.find({$text:{$search:term}})
            .limit(max)
            .skip(start)
            .toArray();
        res.json(query);
    }
    else{
        if(publOnly){
            var query = await usersCollection.find({$text:{$search:term}, isPub:true})
            .limit(max)
            .skip(start)
            .toArray();
        }
        else{
            var query = await usersCollection.find({$text:{$search:term}})
            .limit(max)
            .skip(start)
            .toArray();
        }
        console.log(query);
        res.json(query);
    }
    res.status(200).end();
});

router.get("/search.js", (req, res)=>{
    readFile("./client/scripts/search.js", (err, data)=>{
        if(err){
            res.status(500).end("Server error");
            return;
        }
        res.status(200).end(data);
    });
});

router.get("/search.css", (req, res)=>{
    readFile("./client/styles/search.css", (err, data)=>{
        if(err){
            res.status(500).end("Server error");
            return;
        }
        res.status(200).end(data);
    });
});

export default router;