
const db = await import("../db.js").then(module => module.default);
const usersCollection = db.collection("users");

/**
 * Will check login, not sure if it will return a bool or set a param in req.session
 */
function checkLogin(req, res, next){
    if(!req.session.loggedin || !req.session.uid){
        console.debug("nope")
        next();
    }
    else{
        console.debug(req.session.uid)
        next()
    }
}

/**
 * Will use type param to determin if user is authorized for type of task.
 * Return may change
 * @param {Number} type 
 * @returns {Boolean}
 */
function authorized(type, req, res, next){
    switch(type){
        default:
            console.error("Auth case not defined");
            res.status(500).end("Auth case not defined");
            return;
    }
}

/**
 * Test function. Do not use.
 */
async function test(req, res, next){
    var test = await usersCollection.find({$text: {$search: "Dean"}})
        .toArray();
    console.log(test);
    next();
}

export {
    checkLogin,
    authorized,
    test
}

export default {checkLogin, authorized, test};