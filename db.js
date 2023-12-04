import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/");
let conn;
try {
	conn = await client.connect();
	console.log("connection to db successful")
}
catch(e) {
	console.error(e);
}
let db = conn.db("term");

export default db;