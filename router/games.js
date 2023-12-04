import { Router } from "express";
const router = Router();
import { readFile } from "fs";
const db = await import("../conn.js").then(module => module.default);

const gamesCollection = db.collection("games");


router.use((req, res, next)=>{
    next();
});


export default router;