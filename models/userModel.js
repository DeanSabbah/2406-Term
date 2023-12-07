import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
	name: {type:String, required:true},
	password: {type:String, required:true},
	likes: [Schema.Types.ObjectId],
	reviews: [Schema.Types.ObjectId],
	following: [Schema.Types.ObjectId],
	notifications:[Schema.Types.ObjectId],
	dob: {type:Date, required:true}
});

userSchema.index({name:"text"});

const userModel = mongoose.model("User", userSchema, "users");

export default userModel;