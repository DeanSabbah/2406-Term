import mongoose from "mongoose";
const Schema = mongoose.Schema;

const worskshopSchema = mongoose.Schema({
    name:{type:String, required:true},
    publisher:{type:[String], required:true},
	publisher_id:{type:[Schema.Types.ObjectId], required:true, ref:"User"},
	desc:{type:String, required:true},
    date:{type:Date, required:true},
    enrolled:{type:[Schema.Types.ObjectId], ref:"User"},
    ageRating:{type:Number, default:0, min:0, max:2}
});

const workshopModel = mongoose.model("Workshop", worskshopSchema, "workshops");

export default workshopModel;