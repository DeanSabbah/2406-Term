import games from "./data/result.json" assert {type: "json"};
import users from './data/resultPublishers.json' assert {type: "json"};;

games.forEach(game =>{
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
    game.publisher = game.publisher.split(", ")
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
      
      var result1 = await gamesCollection.drop();
      if(result1){
          console.log("Games collection has been dropped.")
      }
      // Insert the defined document into the "games" collection
      var result = await gamesCollection.insertMany(games);
      console.log("Successfuly inserted " + result.insertedCount + " games.");
      
      const usersCollection = database.collection("users");
      var result1_u = await usersCollection.drop();
      if(result1_u){
          console.log("Users collection has been dropped.")
      }
      // Insert the defined document into the "users" collection
      var result_u = await usersCollection.insertMany(users);
  
      console.log("Successfuly inserted " + result_u.insertedCount + " users.");

      var gamesIn = await gamesCollection.find({"name": {"$exists": true}})
        .toArray();
      var usersIn = await usersCollection.find({"name": {"$exists": true}})
      .toArray();
      gamesIn.forEach((game)=>{
        usersIn.forEach((user)=>{
          if(game.publisher.includes(user.name)){
            if(!user.games){
              user.games = [game._id]
            }
            else{
              user.games.push(game._id);
            }
            if(!game.publisher_id){
              game.publisher_id = [user._id];
            }
            else{
              game.publisher_id[game.publisher.indexOf(`${user.name}`)] = user._id;
            }
          }
        })
      })
      result1 = await gamesCollection.drop();
      if(result1){
          console.log("Games collection has been dropped.")
      }
      // Insert the defined document into the "games" collection
      result = await gamesCollection.insertMany(gamesIn);
      console.log("Successfuly inserted " + result.insertedCount + " games.");
      
      result1_u = await usersCollection.drop();
      if(result1_u){
          console.log("Users collection has been dropped.")
      }
      // Insert the defined document into the "users" collection
      result_u = await usersCollection.insertMany(usersIn);
  
      console.log("Successfuly inserted " + result_u.insertedCount + " users.");
    }
    finally {
       // Close the MongoDB client connection
      await client.close();
    }
  }
  // Run the function and handle any errors
  run().catch(console.dir);