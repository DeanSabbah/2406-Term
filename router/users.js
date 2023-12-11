import { Router } from "express";
const router = Router();
import { readFile } from "fs";
import gameModel from "../models/gameModel.js";
import userModel from "../models/userModel.js";
import notificationModel from "../models/notificationModel.js";

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

router.get("/profile.css", (req, res)=>{
    readFile("./client/styles/profile.css", (err, data)=>{
        if(err){
            res.status(500).end("Server error");
            return;
        }
        res.status(200).end(data);
    });
});

router.route("/follow")
    .put(async (req, res)=>{
        try{
            await userModel.findByIdAndUpdate(req.session.uid, {$push:{following:req.body.uid}}).exec();
            await userModel.findByIdAndUpdate(req.body.uid, {$push:{followers:req.session.uid}}).exec();
            res.status(200).end();
        }
        catch(e){
            console.error(e);
            res.status(500).end("server error");
        }
    })
    .delete(async (req, res)=>{
        try{
            await userModel.findByIdAndUpdate(req.session.uid, {$pull:{following:req.body.uid}}).exec();
            await userModel.findByIdAndUpdate(req.body.uid, {$pull:{followers:req.session.uid}}).exec();
            res.status(200).end();
        }
        catch(e){
            console.error(e);
            res.status(500).end("server error");
        }
    });

router.route("/notificaiton")
    /* will update to only send necessary data if I have time 😪  */
    .get(async (req, res)=>{
        try {
            var user = await userModel.findById(req.session.uid)
                .populate({path:"notifications", populate:{path:"doc"}})
                .exec();
            res.status(200).end(JSON.stringify(user));
        } catch (e) {
            console.error(e);
            res.status(500).end();
        }
    })
    .delete(async (req, res)=>{
        try {
            var user = await userModel.findById(req.session.uid).exec();
            for(var i in user.notifications){
                await notificationModel.deleteOne(user.notifications[i]);
            }
            user.notifications = [];
            await user.save();
            res.status(200).end();
        } catch(e){
            console.error(e);
            res.status(500).end();
        }
    });

router.put("/checkFollowing", async (req, res)=>{
    try{
        var user = await userModel.findById(req.session.uid)
            .populate("following")
            .exec();
        for(var item in user.following){
            if(req.body.uid == user.following[item].id){
                res.status(200).end('true');
                return;
            }
        }
        res.status(200).end('false');
    }
    catch(e){
        console.error(e);
        res.status(500).end();
    }
});

router.put("/checkLiked", async (req, res)=>{
    try{
        var user = await userModel.findById(req.session.uid)
            .populate("likes")
            .exec();
        var game = await gameModel.findById(req.body.gid)
            .exec();
        for(var item in user.likes){
            if(user.likes[item].id == game.id){
                res.status(200).end('true');
                return;
            }
        }
        res.status(200).end('false');
    }
    catch(e){
        console.error(e);
        res.status(500).end();
    }
});

router.put("/isOwn", async (req, res)=>{
    try{
        var user = await userModel.findById(req.session.uid)
            .exec();
        for(var item in user.games){
            if(user.games[item] == req.body.gid){
                res.status(200).end('true');
                return;
            }
        }
        res.status(200).end('false');
    }
    catch(e){
        console.error(e);
        res.status(500).end();
    }
});

router.route("/:uid")
    .get(async (req, res)=>{
        try {
            var id = req.params.uid;
            if(req.params.uid == "myProfile"){
                id = req.session.uid;
            }
            var user = await userModel.findById(id)
                .populate("likes")
                .populate({
                    path:"reviews",
                    populate:{path:"game"}
                })
                .populate("games")
                .populate("workshops")
                .populate("enrolled")
                .exec();
        }
        catch(e){
            res.body = "Bad request";
            res.status(400).render("pages/error",{res:res})
            res.end();
            return;
        }
        try{
            if(!user){
                res.body = "user not found";
                res.status(404).render("pages/error",{res:res})
                res.end();
                return;
            }
            console.log(user);
            res.format({
                html: ()=>{
                    if(req.session.uid != user._id){
                        res.render("pages/profiles/userPage",{user:user});
                    }
                    else{
                        res.render("pages/profiles/ownUserPage",{user:user});
                    }
                },
                json: ()=>{
                    res.json(user);
                }
            });
            res.status(200).end();
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    })

export default router;