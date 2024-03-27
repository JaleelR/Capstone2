const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const router = express.Router();
const { createToken } = require("../token");


/*
Gets {username, password, firstname and lastname} from req.body 
returns a token for accessabilty for the rest of the code
 */
router.post("/register", async function (req, res, next) {
    try {
        const newUser = await User.register({ ...req.body });
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});




/*
Gets {username, password} from req.body 
returns a token for accessabilty for the rest of the code
 */
router.post("/token", async function (req, res, next) {
    try {
        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user);
        return res.json({ token });
    } catch (err) {
        return next(err);
    }
});
module.exports = router;