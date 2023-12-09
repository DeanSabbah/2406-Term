import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = mongoose.Schema({
	user: {type:Schema.Types.ObjectId, ref:"User"},
	game: {type:Schema.Types.ObjectId, ref:"Game"},
	gameName: String,
	rating: Number,
	text: String,
	date: Date
});

const reviewModel = mongoose.model("Review", reviewSchema, "reviews");

export default reviewModel;