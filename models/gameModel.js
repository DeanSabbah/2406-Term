import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gameSchema = mongoose.Schema({
	appid:Number,
	name:{type:String, required:true},
	publisher:{type:[String], required:true},
	publisher_id:{type:[Schema.Types.ObjectId], required:true},
	price:{type:Number, required:true},
	thumbnail:{type:String, required:true},
	desc:{type:String, required:true},
	genre:{type:[String], required:true},
	tags:{type:Object, required:true, index:true},
	reviews:[Schema.Types.ObjectId]
});

gameSchema.index({name:'text', genre:"text", publisher:"text"})

const gameModel = mongoose.model("Game", gameSchema, "games");

export default gameModel;