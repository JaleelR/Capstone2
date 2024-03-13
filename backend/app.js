"use strict";

/** Express app for Money Manager. */

const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const { NotFoundError } = require("./expressError");
const{ Configuration, PlaidApi, PlaidEnvironments } = require ('plaid');
const configuration = new Configuration({
    basePath: PlaidEnvironments.development,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': "65e656d0892dd0001b49ba3e",
            'PLAID-SECRET': "1da89d778689078b52cf1c9b6c1781",
        },
    },
});
const plaidClient = new PlaidApi(configuration);

// const { authenticateJWT } = require("./middleware/auth");
// const authRoutes = require("./routes/auth");
// const companiesRoutes = require("./routes/companies");
// const usersRoutes = require("./routes/users");
// const jobsRoutes = require("./routes/jobs");

// const morgan = require("morgan");

const app = express();

const path = require('path');
const util = require('util');

// app.post('/', async (req, res) => {
//     res.json({ message: "hello" + req.body.name })
// });

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json())
app.use(express.json());
// app.use(morgan("tiny"));
// app.use(authenticateJWT);

// app.use("/auth", authRoutes);
// app.use("/companies", companiesRoutes);
// app.use("/users", usersRoutes);
// app.use("/jobs", jobsRoutes);

app.get('/', async (req, res) => {
    res.json({ message: "hello" });
});

app.post('/hello', async (req, res) => {
    res.json({ message: "Hello " + req.body.name })
});

app.post('/create_link_token', async function (request, response) {
    // Get the client_user_id by searching for the current user
    // const user = await User.find(...);
    // const clientUserId = user.id;
    const plaidRequest = {
        user: {
            // This should correspond to a unique id for the current user.
            client_user_id: "user",
        },
        client_name: 'Plaid Test App',
        products: ['auth'],
        language: 'en',
        country_codes: ['US'],
    };
    try {
        const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
        response.json(createTokenResponse.data);
    } catch (error) {
        // handle error
        console.log(error);
    }
});



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
