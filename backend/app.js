// app.js
"use strict";
require('dotenv').config();
const express = require("express");
const { authenticateJWT, ensureLoggedIn } = require("./auth");
const usersRoutes = require("./routes/users");
const bodyParser = require('body-parser');
const { NotFoundError } = require("./expressError");
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const User = require("./models/user");
const morgan = require("morgan");
const { createToken } = require("./token");
const app = express();


const cors = require("cors");
const path = require('path');
const util = require('util');
const configuration = new Configuration({
    basePath: PlaidEnvironments.development,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID, // Retrieve from environment variable
            'PLAID-SECRET': process.env.PLAID_SECRET_DEVELOPMENT, 
        },
    },
});
const plaidClient = new PlaidApi(configuration);

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json())
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);
app.use("/users", ensureLoggedIn, usersRoutes);

// Routes and other middleware...


app.post('/create_link_token', async function (request, response) {
    // Get the client_user_id by searching for the current user
    // const user = await User.find(...);
    // const clientUserId = user.id;
    const plaidRequest = {
        user: {
            // This should correspond to a unique id for the current user.
            client_user_id: "user",
        },
        client_name: 'Plaid money Manager app',
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


app.post('/exchange_public_token', async function (request, response, next) {
    const publicToken = request.body.publicToken;
    const user = response.locals.user;
    console.log("___________user_______", user);
    try {
        const plaidResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });
        // These values should be saved to a persistent database and
        // associated with the currently signed-in user
        const accessToken = plaidResponse.data.access_token;
        //add to user id
        try {
            await User.updateAccessToken(user.username, accessToken);
            console.log("Backend got access token!!!!!!", accessToken)
            // const itemID = response.data.item_id
            response.json({ accessToken, public_token_exchange: 'complete' });
        } catch (e) {
            console.log("updateAccess Token error", e)
        }
    } catch (error) {
        // handle error
        console.log("Error at plaid response___________", { Failed: error });
        next(error);
    }
});




app.post("/auth", async function (request, response, next) {
    const getUser = response.locals.user;
    console.log("______USER______", getUser)
    try {
        const userToken = await User.getToken(getUser.username);
        console.log("ACTUALL USERTOKEN:",  userToken)
      
        const plaidRequest = {
            access_token: userToken,
        };
      
        const plaidResponse = await plaidClient.authGet(plaidRequest);
        console.log("it worked ")
        return response.json(plaidResponse.data);
        // Here you can use the accessToken as needed
        // For example, you can send it back in the response
       
    } catch (error) {
        console.log("it didnt work")
        next(error); // Pass any errors to the error handling middleware
    }
}
);
 


app.post("/transactions", async function (req, res, next) {
    const getUser = res.locals.user;
    const userToken = await User.getToken(getUser.username);
    console.log("TRANSSACTIONNNNNNNSSS:", userToken)
    try {
        const transactionsResult = await plaidClient.transactionsSync({
            access_token: userToken
        });
       
        return res.json(transactionsResult.data);
    } catch (err) {
        console.log("IT DIDNT WORK");
        return next(err)
    }
});



app.post("/register", async function (req, res, next) {
    try {
        const newUser = await User.register({ ...req.body });
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});

app.post("/token", async function (req, res, next) {
    try {
        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user);
        return res.json({ token });
    } catch (err) {
        return next(err);
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
