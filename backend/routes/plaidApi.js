const express = require("express");
const { ensureCorrectUser, ensureLoggedIn } = require("../auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const router = express.Router();

//Retrives varibles needed from .env file needed for Plaid api
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




/*
Creates a link token to send to Plaid (in usePlaidLink call) to 
open up pop up link to connect bank from Plaid which will make a public token

Returns: public token 
 */

router.post('/create_link_token', async function (request, response) {
    const plaidRequest = {
        user: {
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


/*
Upon succcess of calling creeate_link_token and proper bank information is successfully 
filled out, exchange_public_token will send public token which will be sent to 
plaid to create an access token to use for further plaid api calls 

Returns access Token
 */

router.post('/exchange_public_token', async function (request, response, next) {
    const publicToken = request.body.publicToken;
    const user = response.locals.user;
    console.log("___________user_______", user);
    try {
        const plaidResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });
       
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




/*
plaid/transactions RETURNS the transactions of the account holder 
 */

router.post("/transactions", async function (req, res, next) {
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


/*
plaid/auth RETURNS basic bank information such as balance, account name, routing and account number, number of accounts, etc
 */

router.post("/auth",   async function (request, response, next) {
    const getUser = response.locals.user;
    console.log("______USER______", getUser)
    try {
        const userToken = await User.getToken(getUser.username);
        console.log("ACTUALL USERTOKEN:", userToken)

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







module.exports = router;
