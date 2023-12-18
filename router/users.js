import { Router } from "express";
const router = Router();
import { readFile } from "fs";
import gameModel from "../models/gameModel.js";
import userModel from "../models/userModel.js";
import notificationModel from "../models/notificationModel.js";

//sends css for profile page
router.get("/profile.css", (req, res)=>{
    readFile("./client/styles/profile.css", (err, data)=>{
        if(err){
            res.status(500).end("Server error");
            return;
        }
        res.status(200).end(data);
    });
});

//sends css for profile tabs. Tab functionality and styles were taken from W3Schools Source:https://www.w3schools.com/howto/howto_js_tabs.asp
router.get("/profileTab.css", (req, res)=>{
    readFile("./client/styles/profileTab.css", (err, data)=>{
        if(err){
            res.status(500).end("Server error");
            return;
        }
        res.status(200).end(data);
    });
});

//sends script for profile page
router.get("/profile.js", (req, res)=>{
    readFile("./client/scripts/profile.js", (err, data)=>{
        if(err){
            res.status(500).end("Server error");
            return;
        }
        res.status(200).end(data);
    });
});

//router for following
router.route("/follow")
    //adds follower to followee and following to follower
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
    //removes follower form followee and following from follower
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

//route for notifications
router.route("/notificaiton")
    //sends notifications to users
    .get(async (req, res)=>{
        try {
            var user = await userModel.findById(req.session.uid)
                .populate({path:"notifications", populate:{path:"doc"}})
                .exec();
            res.status(200).end(JSON.stringify({notifications:user.notifications}));
        } catch (e) {
            console.error(e);
            res.status(500).end();
        }
    })
    //removes notificaitons form users after they have been viewed
    .delete(async (req, res)=>{
        try {
            var user = await userModel.findById(req.session.uid).exec();
            user.notifications = [];
            await user.save();
            res.status(200).end();
        } catch(e){
            console.error(e);
            res.status(500).end();
        }
    });

//returns true if user is following page's owner
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

//returns true if user liked game
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

//returns true if game is user's
router.put("/isOwn", async (req, res)=>{
    try{
        var user = await userModel.findById(req.session.uid).exec();
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

//displays user's page by user id
router.route("/:uid")
    .get(async (req, res)=>{
        try {
            //checks for my profile as param
            var id = req.params.uid;
            if(req.params.uid == "myProfile"){
                id = req.session.uid;
            }
            //finds user and populates the details to use in page rendering
            var user = await userModel.findById(id)
                .populate("likes")
                .populate({
                    path:"reviews",
                    populate:{path:"game"}
                })
                .populate("games")
                .populate("workshops")
                .populate("enrolled")
                .populate("following")
                .exec();
        }
        catch(e){
            res.body = "User not found";
            res.status(404).render("pages/error",{res:res})
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
            //allows for JSON requests for users
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
                    //obfuscates data before sending JSON
                    user.password = "Wouldn't you want to know!";
                    for(var game in user.likes){
                        user.likes[game] = user.likes[game].id;
                    }
                    for(var game in user.games){
                        user.games[game] = user.games[game].id;
                    }
                    for(var profile in user.following){
                        user.following[profile] = user.following[profile].id;
                    }
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