CREATE TABLE users (  
  username TEXT UNIQUE NOT NULL PRIMARY KEY,
  token TEXT NOT NULL, 
    first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
 password TEXT NOT NULL,
);
