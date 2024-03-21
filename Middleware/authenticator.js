
const db = await import("../db.js").then(module => module.default);
const usersCollection = db.collection("users");

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

// Will use type param to determin if user is authorized for type of task
function authorized(type, req, res, next){
    switch(type){
        default:
            console.error("Auth case not defined");
            res.status(500).end("Auth case not defined");
            return;
    }
}

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