/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION!: SHUTTING DOWN....');
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log('Connected to Database');
});

const app = require('./app');

const port = 3000;

const server = app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening to port: ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION !, SHUTTING DOWN....');
  server.close(() => {
    process.exit(1);
  });
});
