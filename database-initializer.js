import games from "./data/result.json" assert { type: "json" };
import users from './data/resultPublishers.json' assert { type: "json" };;

//modifies provided JSON and removes irrelevent data, and updates some to make it compatible with models
games.forEach(game => {
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
    game.genre = game.genre.split(", ");
    game.publisher = game.publisher.split(", ");
    game.likes = 0;
    var tag_ar = [];
    var n = 0
    for (var tag in game.tags) {
        tag_ar[n] = tag;
        n++;
    }
    game.tags = tag_ar;
});

users.forEach(user => {
    user._id = user.name.toLowerCase();
    user.dob = "1900-01-01";
    user.isPub = true;
})

import mongoose from "mongoose";
import gameModel from "./models/gameModel.js";
import userModel from "./models/userModel.js";

//inittializes database. Drops all collections, then adds the games and users collections and populates them
async function run() {
    try {
        const uri = "mongodb+srv://deansabbah:PotatoFucker%236@cluster0.6nrq45v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        //const uri = "mongodb://127.0.0.1:27017/term"

        // Connect to the "term" database
        await mongoose.connect(uri);
        console.log("connected to db")
        const database = mongoose.connection;
        const gamesCollection = database.collection("games");

        var result1 = await gamesCollection.drop();
        if (result1) {
            console.log("Games collection has been dropped.")
        }
        // Insert the defined document into the "games" collection
        var result = await gameModel.insertMany(games);
        console.log("Successfuly inserted " + result.insertedCount + " games.");

        const usersCollection = database.collection("users");
        var result1_u = await usersCollection.drop();
        if (result1_u) {
            console.log("Users collection has been dropped.")
        }
        // Insert the defined document into the "users" collection
        var result_u = await userModel.insertMany(users);

        const reviewCollection = database.collection("reviews")
        var result1_r = await reviewCollection.drop();

        if (result1_r) {
            console.log("Reviews collection has been dropped.")
        }

        const workshopCollection = database.collection("workshops")
        var result1_w = await workshopCollection.drop();

        if (result1_w) {
            console.log("Reviews collection has been dropped.")
        }

        const notificaitonCollection = database.collection("notifications")
        var result1_n = await notificaitonCollection.drop();

        if (result1_n) {
            console.log("Reviews collection has been dropped.")
        }
        console.log("Successfuly inserted " + result_u.insertedCount + " users.");

		//adds publiser IDs to games and game IDs to publishers
        var gamesIn = await gamesCollection.find({ "name": { "$exists": true } })
            .toArray();
        var usersIn = await usersCollection.find({ "name": { "$exists": true } })
            .toArray();
        gamesIn.forEach((game) => {
            usersIn.forEach((user) => {
                if (game.publisher.includes(user.name)) {
                    if (!user.games) {
                        user.games = [game._id]
                    }
                    else {
                        user.games.push(game._id);
                    }
                }
            })
        });
        
        result1_u = await usersCollection.drop();
        if (result1_u) {
            console.log("Users collection has been dropped.")
        }
        // Insert the defined document into the "users" collection
        result_u = await usersCollection.insertMany(usersIn);

        console.log("Successfuly inserted " + result_u.insertedCount + " users.");
    }
    finally {
        // Close the Mongoose connection
        mongoose.connection.close()
    }
}
// Run the function and handle any errors
run().catch(console.dir);