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

router.get("/", (req, res)=>{
    res.status(200).render("pages/search");
    res.end();
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