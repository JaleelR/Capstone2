"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser} = require("../auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../token");
const router = express.Router();

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        const user = await User.get(req.params.username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        const user = await User.update(req.params.username, req.body);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        await User.remove(req.params.username);
        return res.json({ deleted: req.params.username });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
