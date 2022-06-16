require('dotenv').config();

module.exports = {
  development: {
    username: process.env.POSTGRE_DEV_USER,
    password: process.env.POSTGRE_DEV_PASS,
    database: process.env.POSTGRE_DEV_DB_NAME,
    host: process.env.POSTGRE_DEV_HOST,
    port: process.env.POSTGRE_DEV_PORT,
    dialect: 'postgres',
    logging: console.log
  },
  test: {
    username: process.env.POSTGRE_TEST_USER,
    password: process.env.POSTGRE_TEST_PASS,
    database: process.env.POSTGRE_TEST_DB_NAME,
    host: process.env.POSTGRE_TEST_HOST,
    port: process.env.POSTGRE_TEST_PORT,
    dialect: 'postgres',
    logging: console.log
  },
  production: {
    username: process.env.POSTGRE_PRO_USER,
    password: process.env.POSTGRE_PRO_PASS,
    database: process.env.POSTGRE_PRO_DB_NAME,
    host: process.env.POSTGRE_PRO_HOST,
    dialect: 'postgres',
    logging: console.log
  },
  dialectOptions: {
    ssl: true
  }
}
