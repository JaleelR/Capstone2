
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

export class Api {
    // the token for interactive with the API will be stored here.
    static token;


    /* skeleton method for get calls  */
    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);

        //there are multiple ways to pass an authorization token, this is how you pass it in the header.
        //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${Api.token}` };
        console.log("headers::::::", headers)
        const params = (method === "get")
            ? data
            : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Individual API routes

    /* Logs in a user */
    static async login(username, password) {
        let res = await this.request(`token`, { username, password }, "post");
        this.token = res.token;
        console.log("login token,", res.token)
        return res.token;
    }

    /* registers a user */
    static async signup(username, password, firstName, lastName) {
        let res = await this.request(`register`, { username, password, firstName, lastName }, "post");
        this.token = res.token;
        return res.token;
    };

    /* gets info on a user */
    static async getUserInfo(username) {
        let res = await this.request(`users/${username}`);
        return res;
    };

    
    static async getLinkToken() {
        let res = await this.request(`create_link_token`, {},  "post");
        return res.link_token;
    };

    static async exchangePublicToken(publicToken) {
        let res = await this.request(`exchange_public_token`, {publicToken},  "post");
        return res;
    };

    /* update User */
    static async updateUser(username, data) {
        let res = await this.request(`users/${username}`, data, "patch");
        return res;
    };

}
