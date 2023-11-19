require("dotenv").config();


function crossCheck(req, res, next) {
    if (res.locals.role === process.env.USER) {
        res.sendStatus(401)
    }
    else {
        next()
    }
}

module.exports = { crossCheck: crossCheck }