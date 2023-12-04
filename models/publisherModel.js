import mongoose from "mongoose";
import userModel from "./userModel.js";

const publisherModel = userModel.discriminator("Publisher", new mongoose.Schema({
    games:[Schema.Types.ObjectId]
}));