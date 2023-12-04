import mongoose from "mongoose";

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

const gameModel = mongoose.model("User", gameSchema);

export default gameModel;