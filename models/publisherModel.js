import mongoose from "mongoose";
import userModel from "./userModel.js";
const Schema = mongoose.Schema;

const publisherModel = userModel.discriminator("Publisher", new mongoose.Schema({games:[Schema.Types.ObjectId],followers:[Schema.Types.ObjectId]}), "users");

export default publisherModel;