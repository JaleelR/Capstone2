CREATE TABLE users (  
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  token TEXT,
  account_id TEXT, 
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  password TEXT NOT NULL
);


-- TRANSACTIONS
-- This table is used to store the transactions associated with each account. The view returns all
-- the data from the transactions table and some data from the accounts view. For more info on the
-- Plaid Transactions schema, see the docs page: https://plaid.com/docs/#transaction-schema

CREATE TABLE transactions
(
  transaction_id TEXT PRIMARY KEY,
user_id integer REFERENCES users(id) ON DELETE CASCADE ,
  category text NOT NULL,
  name text NOT NULL,
  amount numeric(28,10) NOT NULL,
  days_requested integer,
  iso_currency_code text,
  date date NOT NULL,
  CONSTRAINT unique_transaction UNIQUE (transaction_id)
);
