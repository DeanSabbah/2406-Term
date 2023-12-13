import { Router } from "express";
const router = Router();
import { readFile } from "fs";
import userModel from "../models/userModel.js";
import notificationModel from "../models/notificationModel.js";
import workshopModel from "../models/workshopModel.js";

router.use((req, res, next)=>{
    next();
});

//double checking if user is a publisher
async function checkPub(req, res){
    if(!req.session.loggedin || !req.session.uid){
        res.status(401).end("Not logged in");
        return;
    }
    try{
        var user = await userModel.findById(req.session.uid).exec();
        return user.isPub;
    }
    catch(e){
        console.error(e);
        res.status(500).end();
    }
}

//sends script for new workshop form
router.get("/newWorkshop.js", (req, res)=>{
    readFile("./client/scripts/newWorkshop.js", (err, data)=>{
        if(err){
            res.status(500).end();
            return;
        }
        res.status(200).end(data);
    });
});

//sends script for wrokshop page
router.get("/workshop.js", (req, res)=>{
    readFile("./client/scripts/workshop.js", (err, data)=>{
        if(err){
            res.status(500).end();
            return;
        }
        res.status(200).end(data);
    });
});

//sends css for workshop page
router.get("/workshop.css", (req, res)=>{
    readFile("./client/styles/workshop.css", (err, data)=>{
        if(err){
            res.status(500).end();
            return;
        }
        res.status(200).end(data);
    });
});

//returns true if workshop is user's
router.put("/isOwn", async (req, res)=>{
    try{
        var user = await userModel.findById(req.session.uid).exec();
        for(var item in user.workshops){
            if(user.workshops[item] == req.body.wid){
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

//returns true if user is enrolled
router.put("/checkEnrolled", async (req, res)=>{
    try{
        var user = await userModel.findById(req.session.uid)
            .populate("enrolled")
            .exec();
        for(var item in user.enrolled){
            if(req.body.wid == user.enrolled[item].id){
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

//route for enrolling
router.route("/enroll")
    //enrolls user into workshop
    .put(async (req, res)=>{
        try {
            await userModel.findByIdAndUpdate(req.session.uid, {$push:{enrolled:req.body.wid}}).exec();
            await workshopModel.findByIdAndUpdate(req.body.wid, {$push:{enrolled:req.session.uid}}).exec();
            res.status(200).end()
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    })
    //unerolls user from workshop
    .delete(async (req, res)=>{
        try {
            await userModel.findByIdAndUpdate(req.session.uid, {$pull:{enrolled:req.body.wid}}).exec();
            await workshopModel.findByIdAndUpdate(req.body.wid, {$pull:{enrolled:req.session.uid}}).exec();
            res.status(200).end()
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    });

//route for new workshop
router.route("/newWorkshop")
    //sends form for new workshop
    .get(async (req, res)=>{
        if(!await checkPub(req, res)){
            res.status(401).end("Must be publisher");
            return;
        }
        res.render("pages/workshops/newWorkshop");
        res.status(200).end();
    })
    //post new workshop to database
    .post(async (req, res) => {
        try {
            var user = await userModel.findById(req.session.uid).exec();
            if(!user.isPub){
                res.status(401).end("not publisher");
                return;
            }
            var nameCheck = await workshopModel.findOne({name:req.body.name}).exec();
            if(nameCheck){
                res.status(409).end("Workshop already exists");
                return;
            }
            var workshop = await workshopModel.create({ name: req.body.name, publisher: [user.name], publisher_id: [req.session.uid], desc: req.body.desc,date: req.body.date});
            var notification = await notificationModel.create({docModel:"Workshop", doc:workshop.id});
            for(var id in user.followers){
                await userModel.findByIdAndUpdate(user.followers[id], {$push:{notifications:notification.id}});
            }
            await userModel.findByIdAndUpdate(req.session.uid, {$push:{workshops:workshop.id}}).exec();
            res.status(200).end(JSON.stringify({id:workshop.id}));
        } 
        catch (e) {
            console.error(e);
            res.status(500).end("server error");
        }
    })

//route for workshops
router.route("/:wid")
    //renders workshop page
    .get(async (req, res)=>{
        try{
            var workshop = await workshopModel.findById(req.params.wid)
                .populate("enrolled")
                .exec();
            if(!workshop){
                res.body = "Workshop not found";
                res.status(404).render("pages/error", {res:res});
                res.end("Workshop not found")
                return;
            }
            res.status(200).render("pages/workshops/workshop", {data:workshop});
            res.end();
        }
        catch(e){
            console.error(e);
            res.status(500).end;
        }
    });

export default router;