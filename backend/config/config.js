import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    url: process.env.DB_URI,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // ⚠️ set to true in production with trusted CA
      },
    },
  },
  test: {
    url: process.env.DB_URI_TEST || '', // optionally separate test DB URI
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
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
  },
};
