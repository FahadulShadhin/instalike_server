require('dotenv').config();

const appPort = process.env.APP_PORT;
const pgUser = process.env.PGUSER;
const pgHost = process.env.PGHOST;
const pgDatabase = process.env.PGDATABASE;
const pgPassword = process.env.PGPASSWORD;
const pgPort = process.env.PGPORT;
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const variables = {
	appPort,
	pgUser,
	pgHost,
	pgDatabase,
	pgPassword,
	pgPort,
	jwtSecretKey,
};

module.exports = variables;
