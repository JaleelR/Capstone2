const db = require("../db");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

let errorLogged = false; // Declare the errorLogged variable outside of the method

class Transactions {
    static async insertTransactions(transaction_id, userId, category, name, amount, isoCurrencyCode, date) {
        try {
            const result = await db.query(`
                INSERT INTO Transactions (transaction_id, user_id, category, name, amount, iso_currency_code, date)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [transaction_id, userId, category, name, amount, isoCurrencyCode, date],
            );

            const transactions = result;

            if (!transactions) {
                throw new UnauthorizedError("Transactions error");
            }

            return transactions;
        }
        catch (error) {
            if (error.code === '23505' && !errorLogged) {
                console.log("---Received the most recent transactions----");
                errorLogged = true;
                return; // Return here to stop further execution
            }
            else if (error.code === '23505' && errorLogged) {
                // Do nothing if the error has already been logged
                return;
            }
            else {
                console.log({ message: error.message });
                return;
            }
        }
    };


    static async getAllTransactions(userId) {
        const result = await db.query(`
        SELECT name, amount, date, iso_currency_code 
        FROM transactions
    `,);
        const allTransactions = result;
        if (!allTransactions) {
            throw new UnauthorizedError("Transactions error");
        };
        return allTransactions;
    };




}

module.exports = Transactions;
