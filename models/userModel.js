import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
	_id: String,
	name: {type:String, required:true},
	password: {type:String, required:true},
	likes: [{type:Schema.Types.ObjectId, ref:"Game"}],
	reviews: [{type:Schema.Types.ObjectId, ref:"Review"}],
	following: [{type:Schema.Types.ObjectId, ref:"User"}],
    followers:[{type:Schema.Types.ObjectId, ref:"User"}],
	notifications:[{type:Schema.Types.ObjectId, ref:"Notification"}],
	dob: {type:Date, required:true},
	isPub:Boolean,
    games: [{type:Schema.Types.ObjectId, ref:"Game"}],
    workshops: [{type:Schema.Types.ObjectId, ref:"Workshop"}],
	enrolled: [{type:Schema.Types.ObjectId, ref:"Workshop"}]
}, {_id: false});

//add the name property to a text index making queries for them much easier
userSchema.index({name:"text"});

const userModel = mongoose.model("User", userSchema, "users");

export default userModel;