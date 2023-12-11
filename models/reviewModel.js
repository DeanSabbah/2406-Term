import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = mongoose.Schema({
	user: {type:Schema.Types.ObjectId, required:true, ref:"User"},
	game: {type:Schema.Types.ObjectId, required:true, ref:"Game"},
	text: {type:String, required:true},
	rating: {
		type:Number,
		required:true,
		min:0,
		max:10
	},
	date: {type:Date, required:true}
});

const reviewModel = mongoose.model("Review", reviewSchema, "reviews");

export default reviewModel;