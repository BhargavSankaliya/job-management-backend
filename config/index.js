require('dotenv').config(); // Load environment variables from .env

let config;

switch (process.env.NODE_ENV) {
  // case 'production':
  //   config = {
  //     db: {
  //       uri: process.env.PROD_DB_URI,
  //     },
  //     server: {
  //       port: process.env.PROD_PORT,
  //     }
  //   };
  //   break;
  // case 'staging':
  //   config = {
  //     db: {
  //       uri: process.env.STAGING_DB_URI,
  //     },
  //     server: {
  //       port: process.env.STAGING_PORT,
  //     }
  //   };
  //   break;
  case 'development':
  default:
    config = {
      db: {
        uri: process.env.DEV_DB_URI,
      },
      server: {
        port: process.env.DEV_PORT,
      }
    };
    break;
}

module.exports = config;
