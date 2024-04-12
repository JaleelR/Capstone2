const { query } = require("express");
const db = require("../db");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

let errorLogged = false; // Declare the errorLogged variable outside of the method

class Transactions {
    static async insertTransactions(transaction_id, userId, category, merchant_name, amount, isoCurrencyCode, date) {
        try {
            const result = await db.query(`
                INSERT INTO Transactions (transaction_id, user_id, category, merchant_name, amount, iso_currency_code, date)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [transaction_id, userId, category, merchant_name, amount, isoCurrencyCode, date],
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


    static async getTransactions(user_id, orderByColumn = 'date', orderBy = 'DESC') {
        const queryString = `
        SELECT transaction_id, merchant_name, amount, date, iso_currency_code 
        FROM transactions where user_id = $1
        ORDER BY ${orderByColumn} ${orderBy}
    `;
        console.log('SQL Query:', queryString); // Log the SQL query
        const result = await db.query(queryString, [user_id]);
        const allTransactions = result.rows;
        if (!allTransactions) {
            throw new NotFoundError("Transactions error");
        };
        return allTransactions;
    };






}

module.exports = Transactions;
