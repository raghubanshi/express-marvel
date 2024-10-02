\echo 'Delete and recreate marvel db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE marvel;
CREATE DATABASE marvel;
\connect marvel

\i marvel-schema.sql


\echo 'Delete and recreate marvel_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE marvel_test;
CREATE DATABASE marvel_test;
\connect marvel_test

\i marvel-schema.sql