import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notificationSchema = mongoose.Schema({
    docModel: {
        type: String,
        required: true,
        enum: ['Game', 'Workshop']
    },
    doc:{
        type:Schema.Types.ObjectId,
        required:true,
        refPath:"docModel"
    },
    count:{
        type:Number,
        required:true
    }
});

const notificationModel = mongoose.model("Notification", notificationSchema, "notifications");

export default notificationModel;