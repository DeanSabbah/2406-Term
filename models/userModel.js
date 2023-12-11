import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
	name: {type:String, required:true},
	password: {type:String, required:true},
	likes: [{type:Schema.Types.ObjectId, ref:"Game"}],
	reviews: [{type:Schema.Types.ObjectId, ref:"Review"}],
	following: [{type:Schema.Types.ObjectId, ref:"User"}],
    followers:[{type:Schema.Types.ObjectId, ref:"User"}],
	notifications:[{type:Schema.Types.ObjectId, ref:"Game"}],
	dob: {type:Date, required:true},
	isPub:Boolean,
    games: [{type:Schema.Types.ObjectId, ref:"Game"}]
});

userSchema.index({name:"text"});

const userModel = mongoose.model("User", userSchema, "users");

export default userModel;