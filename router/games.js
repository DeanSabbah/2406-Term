import { Router } from "express";
const router = Router();
import { readFile } from "fs";
import gameModel from "../models/gameModel.js";
import userModel from "../models/userModel.js";
import reviewModel from "../models/reviewModel.js";
import notificationModel from "../models/notificationModel.js";

//sends game page js script
router.get("/gameId.js", (req, res)=>{
	readFile("./client/scripts/gameId.js", (err, data)=>{
		if(err){
			res.status(500).end();
			return;
		}
		res.status(200).end(data);
	});
});

//sends new game form's js script
router.get("/newGame.js", (req, res)=>{
	readFile("./client/scripts/newGame.js", (err, data)=>{
		if(err){
			res.status(500).end();
			return;
		}
		res.status(200).end(data);
	});
});

//sends game page css file
router.get("/game.css", (req, res)=>{
	readFile("./client/styles/game.css", (err, data)=>{
		if(err){
			res.status(500).end();
			return;
		}
		res.status(200).end(data);
	});
});

//route for liking a game
router.route("/like")
	//add like to game
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
	//removes like from game
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

//route for reviews
router.route("/review")
	//adds review to game
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
	//removes review from game
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

//route for new games
router.route("/newGame")
	//shows new game form
	.get(async (req, res)=>{
		res.render("pages/games/newGame");
		res.status(200).end();
	})
	//posts new game to the database
	.post(async (req, res) => {
		try {;
			var genre = req.body.genres.split(", ");
			var tags = req.body.tags.split(", ");
			var user = await userModel.findById(req.session.uid).exec();
			if(!user.isPub){
				user.isPub = true;
			}
			user.save();
			var nameCheck = await gameModel.findOne({name:req.body.name}).exec();
			if(nameCheck){
				res.status(409).end("Game already exists");
				return;
			}
			//if the user provided a Steam appID, then it is added to the docuemnt, allowing the real game to be linked to on the game's page
			if (!req.body.appid) {
				var newGame = await gameModel.create({ name: req.body.name, publisher: [user.name], publisher_id: [req.session.uid], price: req.body.price*100, thumbnail: req.body.thumbnail, desc: req.body.desc, genre: genre, tags: tags, release_date: req.body.release_date });
			}
			else {
				var newGame = await gameModel.create({ appid: req.body.appid, publisher: [user.name], name: req.body.name, publisher_id: [req.session.uid], price: req.body.price*100, thumbnail: req.body.thumbnail, desc: req.body.desc, genre: genre, tags: tags, release_date: req.body.release_date });
			}
			//sends notificaitons to all users following the publisher
			var notification = await notificationModel.create({docModel:"Game", doc:newGame.id, count:user.followers.length});
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

//displays game page
router.route("/:appid")
	.get(async (req, res, next)=>{
		try {
			var game = await gameModel.findById(req.params.appid)
				.populate({
					path:"reviews",
					populate:{path:"user"}
				})
				.exec();
			}
		catch(e){
			console.error(e);
			res.body = "Game not found";
			res.status(404).render("pages/error",{res:res});
			res.end()
			return;
		}
		try{
			if(!game){
				res.body = "Game not found";
				res.status(404).render("pages/error", {res:res});
				res.end();
				return;
			}
			res.format({
				html: ()=>{
					res.render("pages/games/gameId", {gameData:game, uid:req.session.uid});
				},
				json: ()=>{
					res.json(game);
				}
			});
			res.status(200).end();
		} catch (e) {
			console.error(e);
			res.status(500).end();
		}
	});

export default router;