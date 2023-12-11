import mongoose from "mongoose";
mongoose.Promise = global.Promise;

await mongoose.connect("mongodb://127.0.0.1:27017/term");
console.log("connected to db")

let db = mongoose.connection;

export default db;