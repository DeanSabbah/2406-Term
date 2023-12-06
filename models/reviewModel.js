import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = mongoose.Schema({
	user: Schema.Types.ObjectId,
	game: Schema.Types.ObjectId,
	rating: Number,
	text: String,
	date: Date
});

const reviewModel = mongoose.model("Review", reviewSchema, "reviews");

export default reviewModel;