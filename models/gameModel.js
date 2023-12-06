import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gameSchema = mongoose.Schema({
	appid:Number,
	name:String,
	publisher:[String],
	price:Number,
	thumbnail:String,
	desc:String,
	genre:[String],
	tags:{type:Number},
	reviews:[Schema.Types.ObjectId]
});

const gameModel = mongoose.model("Game", gameSchema, "games");

export default gameModel;