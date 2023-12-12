import { Router } from "express";
const router = Router();
import { readFile } from "fs";
import gameModel from "../models/gameModel.js";
import userModel from "../models/userModel.js";
import reviewModel from "../models/reviewModel.js";
import notificationModel from "../models/notificationModel.js";

router.use((req, res, next)=>{
    next();
});

async function checkPub(req, res){
    var user = await userModel.findById(req.session.uid).exec();
    return user.isPub;
}

router.get("/gameId.js", (req, res)=>{
    readFile("./client/scripts/gameId.js", (err, data)=>{
        if(err){
            res.status(500).end();
            return;
        }
        res.status(200).end(data);
    });
});

router.get("/newGame.js", (req, res)=>{
    readFile("./client/scripts/newGame.js", (err, data)=>{
        if(err){
            res.status(500).end();
            return;
        }
        res.status(200).end(data);
    });
});

router.get("/game.css", (req, res)=>{
    readFile("./client/styles/game.css", (err, data)=>{
        if(err){
            res.status(500).end();
            return;
        }
        res.status(200).end(data);
    });
});

router.route("/like")
    .put(async (req, res)=>{
        try{
            await userModel.findByIdAndUpdate(req.session.uid, {$push:{likes:req.body.gid}})
                .exec();
            await gameModel.findByIdAndUpdate(req.body.gid, {$inc:{likes:1}})
                .exec();
            res.status(200).end();
        }
        catch(e){
            console.error(e);
            res.status(500).end("server error");
        }
    })
    .delete(async (req, res)=>{
        try{
            await userModel.findByIdAndUpdate(req.session.uid, {$pull:{likes:req.body.gid}}).exec();
            await gameModel.findByIdAndUpdate(req.body.gid, {$inc:{likes:-1}}).exec();
            res.status(200).end();
        }
        catch(e){
            console.error(e);
            res.status(500).end("server error");
        }
    });

router.route("/review")
    .post(async (req, res)=>{
        try{
            var review = await reviewModel.create({user:req.session.uid, game:req.body.gid, text:req.body.text, rating:req.body.rating, date:new Date().toUTCString()});
            await userModel.findByIdAndUpdate(req.session.uid, {$push:{reviews:review.id}}).exec();
            await gameModel.findByIdAndUpdate(req.body.gid, {$push:{reviews:review.id}}).exec();
            res.status(200).end();
        }
        catch(e){
            console.error(e);
            res.status(500).end("server error");
        }
    })
    .delete(async (req, res)=>{
        try{+
            await userModel.findByIdAndUpdate(req.session.uid, {$pull:{reviews:req.body.rid}}).exec();
            await gameModel.findByIdAndUpdate(req.body.gid, {$pull:{reviews:req.body.rid}}).exec();
            await reviewModel.findByIdAndDelete(req.body.rid);
            res.status(200).end();
        }
        catch(e){
            console.error(e);
            res.status(500).end("server error");
        }
    });

router.route("/newGame")
    .get(async (req, res)=>{
        if(!await checkPub(req, res)){
            res.status(401).end("Must be publisher");
            return;
        }
        res.render("pages/games/newGame");
        res.status(200).end();
    })
    .post(async (req, res) => {
        try {;
            var genre = req.body.genres.split(", ");
            var tags = req.body.tags.split(", ");
            var user = await userModel.findById(req.session.uid).exec();
            if(!user.isPub){
                res.status(401).end("not publisher");
                return;
            }
            var nameCheck = await gameModel.findOne({name:req.body.name}).exec();
            if(nameCheck){
                res.status(409).end("Game already exists");
                return;
            }
            if (!req.body.appid) {
                var newGame = await gameModel.create({ name: req.body.name, publisher: [user.name], publisher_id: [req.session.uid], price: req.body.price*100, thumbnail: req.body.thumbnail, desc: req.body.desc, genre: genre, tags: tags, release_date: req.body.release_date });
            }
            else {
                var newGame = await gameModel.create({ appid: req.body.appid, publisher: [user.name], name: req.body.name, publisher_id: [req.session.uid], price: req.body.price*100, thumbnail: req.body.thumbnail, desc: req.body.desc, genre: genre, tags: tags, release_date: req.body.release_date });
            }
            var notification = await notificationModel.create({docModel:"Game", doc:newGame.id});
            for(var id in user.followers){
                await userModel.findByIdAndUpdate(user.followers[id], {$push:{notifications:notification.id}});
            }
            await userModel.findByIdAndUpdate(req.session.uid, {$push:{games:newGame.id}}).exec();
            res.status(200).end(JSON.stringify({id:newGame.id}));
        } 
        catch (e) {
            console.error(e);
            res.status(500).end("server error");
        }
    })

router.route("/:appid")
    .get(async (req, res, next)=>{
        try {
            var q = await gameModel.findById(req.params.appid)
                .populate({
                    path:"reviews",
                    populate:{path:"user"}
                })
                .exec();
            console.log(q);
            if(!q){
                res.status(404).render("pages/error", {res:res});
                res.end();
                return;
            }
            res.format({
                html: ()=>{
                    res.render("pages/games/gameId", {gameData:q, uid:req.session.uid})
                },
                json: ()=>{
                    res.json(q)
                }
            });
            res.status(200).end();
        } catch (e) {
            console.error(e);
            res.status(500).end();
        }
    })

export default router;