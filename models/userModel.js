import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	name: String,
	password: String,
	likes: [Schema.Types.ObjectId],
	reviews: [Schema.Types.ObjectId],
	dob: Date
});

const userModel = mongoose.model("User", userSchema);

export default userModel;