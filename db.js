//connects to database. Allows for connection to be used in routers.
import mongoose from "mongoose";

const uri = "mongodb+srv://deansabbah:PotatoFucker%236@cluster0.6nrq45v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


await mongoose.connect(uri);
console.log("connected to db")

let db = mongoose.connection;

export default db;
