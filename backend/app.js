// app.js
"use strict";
require('dotenv').config();
const express = require("express");
const { authenticateJWT, ensureLoggedIn } = require("./auth");

const bodyParser = require('body-parser');
const { NotFoundError } = require("./expressError");
const User = require("./models/user");
const morgan = require("morgan");
const app = express();
const plaidRoutes = require("./routes/plaidApi")
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const cors = require("cors");
const path = require('path');
const util = require('util');


app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json())
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/plaid", plaidRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);







/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;
