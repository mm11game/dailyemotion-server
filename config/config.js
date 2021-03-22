const dotenv = require('dotenv');
dotenv.config();

const config = {
  development:
   {
    host: process.env.DATABASE_SPRINT_HOST,
    user: process.env.DATABASE_SPRINT_USER,
    password: process.env.DATABASE_SPRINT_PASSWORD,
    database: 'dailyemotion',
    dialect: 'mysql',
    logging: false,
    port: '13306',
    username:process.env.DATABASE_SPRINT_USER
    

  }
  ,
  test: {
    host: process.env.DATABASE_SPRINT_HOST,
    username: process.env.DATABASE_SPRINT_USER,
    password: process.env.DATABASE_SPRINT_PASSWORD,
    database: 'dailyemotion',
    dialect: 'mysql',
    logging: false
  }
};

module.exports = config;
