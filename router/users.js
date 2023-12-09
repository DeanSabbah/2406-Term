import { Router } from "express";
const router = Router();
import { readFile } from "fs";
import gameModel from "../models/gameModel.js";
import userModel from "../models/userModel.js";
import reviewModel from "../models/reviewModel.js";

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

router.route("/notificaiton")
    /* will update to only send necessary data if I have time 😪  */
    .get(async (req, res)=>{
        var username = '"'+req.session.username.replace(/\s/g, '"\\ \\"')+'"';
        var user = await userModel.findOne({$text:{$search:username}})
            .populate({path:"notifications"})
            .exec();
        res.status(200).end(JSON.stringify(user));
    })
    .delete(async (req, res)=>{
        var username = '"'+req.session.username.replace(/\s/g, '"\\ \\"')+'"';
        await userModel.findOneAndUpdate({$text:{$search:username}}, {notifications:[]}).exec();
        res.status(200).end();
    });

router.route("/myProfile")
    .get(async (req, res)=>{
        var username = '"'+req.session.username.replace(/\s/g, '"\\ \\"')+'"';
        if(!username || !req.session.loggedin){
            res.status(401).end("not logged in");
            return;
        }
        var user = await userModel
            .findOne({$text:{$search:username}})
            .populate("likes")
            .populate("reviews")
            .exec();
        if(user == null){
            res.status(500).end("Server error");
            return;
        }
        res.render("pages/profiles/ownUserPage",{user:user});
        res.status(200).end();
    });

router.route("/:uid")
    .get(async (req, res)=>{
        var user = await userModel
            .findById(req.params.uid)
            .populate("likes")
            .populate("reviews")
            .exec();
        if(!user){
            res.body = "user not found";
            res.status(404).render("pages/error",{res:res})
            res.end();
            return;
        }
        console.log(user);
        res.format({
            html: ()=>{
                if(req.session.username != user.name){
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
    })

export default router;