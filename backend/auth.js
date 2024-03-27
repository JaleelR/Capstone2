// auth.js
"use strict";

/*
Used to check Users that are logged in and what they can and cannot view in routes
 */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("./config");
const { UnauthorizedError } = require("./expressError");

//Checks for jwt in the request headers. If present get the token, verify and decode user information to response locals 
//for further requests. If not present proceed to next middleware
function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            const decoded = jwt.verify(token, SECRET_KEY);
            res.locals.user = decoded;
        }
        return next();
    } catch (err) {
        return next();
    }
}

//checks if user information is in res.locals if so continue with next middleware if not proceed with error 
function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err);
    }
}



/* 
Gets user from res.locals. If user.username matches the req.params username
move on to next code if not move on with an error
*/
function ensureCorrectUser(req, res, next) {
    try {
        const user = res.locals.user;
        if (!(user && user.username === req.params.username)) {
            throw new UnauthorizedError();
        }
        return next();
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureCorrectUser,
};
