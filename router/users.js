import { Router } from "express";
const router = Router();
import { readFile } from "fs";
const db = await import("../conn.js").then(module => module.default);

const usersCollection = db.collection("users");



export default router;