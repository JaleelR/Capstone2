// auth.js
"use strict";

/*
Used to check Users that are logged in and what they can and cannot view in routes
 */


//Checks for jwt in the request headers. If present get the token, verify and decode user information to response locals 
//for further requests. If not present proceed to next middleware
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("./config");
const { UnauthorizedError } = require("./expressError");
const User = require("./models/user")
/** Middleware to extract and verify JWT from Bearer Authorization header. */


function authenticateJWT(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
      
    if (token) {
        console.log("Received Token:", token);  // Log received token

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            req.user = decoded;
            next();
        });
    } else {
       next();
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
async function ensureCorrectUser(req, res, next) {
    try {
        const userToken = await User.getAuthToken(req.headers.authorization.substring(7)); // Extracting only the token from the header
        if (!userToken) {
            throw new UnauthorizedError("Invalid token");
        }

        if (userToken !== req.headers.authorization.substring(7)) { // Comparing only the token
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
