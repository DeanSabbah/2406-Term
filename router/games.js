import { Router } from "express";
const router = Router();
import { readFile } from "fs";
const db = await import("../db.js").then(module => module.default);

const gamesCollection = db.collection("games");

router.use((req, res, next)=>{
    next();
});

router.get("/gameId.js", (req, res)=>{
    readFile("./client/scripts/gameId.js", (err, data)=>{
        if(err){
            res.status(500).end();
            return;
        }
        res.status(200).end(data);
    });
});

router.route("/:appid")
    .get(async (req, res, next)=>{
        var q = await gamesCollection.findOne({appid:parseInt(req.params.appid)});
        console.log(q)
        res.format({
            html: ()=>{
                if(q == null){
                    res.body = "Resource not found";
                    res.status(404).render("pages/error", {res:res});
                    res.end();
                    return;
                }
                res.render("pages/games/gameId", {gameData:q})
            },
            json: ()=>{
                res.json(q)
            }
        });
        res.status(200).end();
    });

export default router;