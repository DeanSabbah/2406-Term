import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
	user: Schema.Types.ObjectId,
	game: Schema.Types.ObjectId,
	rating: Number,
	text: String,
	date: Date
});

const reviewModel = mongoose.model("User", reviewSchema);

export default reviewModel;