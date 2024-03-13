\echo 'Delete and recreate Money Manager db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE MoneyManager;
CREATE DATABASE MoneyManager;
\connect MoneyManager

\i MM-schema.sql
\i MM-seed.sql

\echo 'Delete and recreate jobly_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE MM_test;
CREATE DATABASE MM_test;
\connect MM_test

\i MM-schema.sql
