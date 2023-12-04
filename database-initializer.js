import games, { forEach } from "./data/result.json";
import users from './data/resultPublishers.json';

forEach(game =>{
    game.price = parseInt(game.price)
    delete game.developer;
    delete game.score_rank;
    delete game.positive;
    delete game.negative;
    delete game.userscore;
    delete game.owners;
    delete game.average_2weeks;
    delete game.average_forever;
    delete game.median_2weeks;
    delete game.median_forever;
    delete game.initialprice;
    delete game.discount;
    delete game.ccu;
    game.genre = game.genre.split(", ")
});

import { MongoClient } from "mongodb";

const uri = "mongodb://127.0.0.1:27017/";
// Create a new client and connect to MongoDB
const client = new MongoClient(uri);
async function run() {
    try {
      // Connect to the "term" database
      const database = client.db("term");
      const gamesCollection = database.collection("games");
      
      const result1 = await gamesCollection.drop();
      if(result1){
          console.log("Games collection has been dropped.")
      }
      // Insert the defined document into the "games" collection
      const result = await gamesCollection.insertMany(games);
      console.log("Successfuly inserted " + result.insertedCount + " users.");
      
      const usersCollection = database.collection("users");
      const result1_u = await usersCollection.drop();
      if(result1_u){
          console.log("Users collection has been dropped.")
      }
      // Insert the defined document into the "users" collection
      const result_u = await usersCollection.insertMany(users);
  
      console.log("Successfuly inserted " + result_u.insertedCount + " users.");
    } finally {
       // Close the MongoDB client connection
      await client.close();
    }
  }
  // Run the function and handle any errors
  run().catch(console.dir);
  console.log("hey")