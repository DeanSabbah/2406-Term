const express = require("express");
const router = express.Router();
const fs = require("fs");


router.use((req, res, next)=>{
    next();
});


module.exports = router;