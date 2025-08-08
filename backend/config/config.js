// {
//   "development": {
//     "username": "root",
//     "password": null,
//     "database": "database_development",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "test": {
//     "username": "root",
//     "password": null,
//     "database": "database_test",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "production": {
//     "username": "root",
//     "password": null,
//     "database": "database_production",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   }
// }

// config/config.js
// config/config.js
import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    url: process.env.DB_URI,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // ⚠️ use `true` in production with trusted CA
      },
    },
  },
  production: {
    url: process.env.DB_URI,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
};

