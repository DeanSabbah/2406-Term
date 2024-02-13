import { Router } from "express";
const router = Router();
import { readFile } from "fs";
const db = await import("../db.js").then(module => module.default);

const usersCollection = db.collection("users");
const gamesCollection = db.collection("games");
const max = 10;

router.get("/", async (req, res)=>{
    //renders empty page
    if(Object.keys(req.query).length <= 0){
        res.status(200).render("pages/search/search");
        res.end();
    }
    //handles pagination and first search results
    else{
        try {
            var term = '"' + req.query.search.replace(/\s/g, '"\\ \\"') + '"';
            //checks if the user wants to search for games or users
            var type = parseInt(req.query.type);
            //checks if the user wants only publishers
            var pubOnly = req.query.pubOnly === "true";
            var start = 0;
            //for pagination
            if (req.query.startPos) {
                start = parseInt(req.query.startPos);
            }
            //games search
            if (!type) {
                var query = await gamesCollection.find({ $text: { $search: term } })
                    .limit(max)
                    .skip(start)
                    .toArray();
            } 
            //user seach
            else {
                if (pubOnly) {
                    var query = await usersCollection.find({ $text: { $search: term }, isPub: true })
                        .limit(max)
                        .skip(start)
                        .toArray();
                } 
                else {
                    var query = await usersCollection.find({ $text: { $search: term } })
                        .limit(max)
                        .skip(start)
                        .toArray();
                }
            }
            //if there first results, renders new page with up to max items
            if(start == 0){
                res.render("pages/search/results", {query:query, type:type, qIn:req.query});
            }
            //else sends up to the next max items
            else{
                res.json(query);
            }
            res.status(200).end();
        } catch (error) {
            console.error(error);
            res.status(500).end("Server error");
        }
    }
});

//sends script for search form
router.get("/search.js", (req, res)=>{
    readFile("./client/scripts/search.js", (err, data)=>{
        if(err){
            res.status(500).end("Server error");
            return;
        }
        res.status(200).end(data);
    });
});

//sends css for search form
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