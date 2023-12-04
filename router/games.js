import { Router } from "express";
const router = Router();
import { readFile } from "fs";
const db = await import("../db.js").then(module => module.default);

const gamesCollection = db.collection("games");

router.use((req, res, next)=>{
    next();
});

router.route("/:appid")
    .get(async (req, res)=>{
        var q = await gamesCollection.find({appid:parseInt(req.params.appid)})
            .toArray();
        console.log(q)
        res.format({
            html: ()=>{
                res.render("pages/games/gameId", {gameData:q})
            },
            json: ()=>{
                res.json(q)
            }
        });
        res.status(200).end();
    })
export default router;