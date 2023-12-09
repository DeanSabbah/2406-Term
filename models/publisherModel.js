import mongoose from "mongoose";
import userModel from "./userModel.js";
const Schema = mongoose.Schema;

const publisherModel = userModel.discriminator("Publisher", new mongoose.Schema({
    games: [{type:Schema.Types.ObjectId, ref:"Game"}],
	likes: [{type:Schema.Types.ObjectId, ref:"Game"}]
    }), "users");

export default publisherModel;