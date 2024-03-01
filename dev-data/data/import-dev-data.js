/* eslint-disable import/newline-after-import */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-dynamic-require */
const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require(`${__dirname}/../../models/tourModels.js`);
const User = require(`${__dirname}/../../models/userModel.js`);
const Review = require(`${__dirname}/../../models/reviewModel.js`);

dotenv.config({ path: `${__dirname}/../../config.env` });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then(() => {
  console.log('Connected to Database');
});

//Reading the data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);
//Importing the data
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data is imported!');
  } catch (error) {
    console.log(error);
  }
};

//Deleting all the data
const deleteData = async () => {
  try {
    await Tour.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    console.log('Data deleted sucessfuly!');
  } catch (error) {
    console.log('Error!');
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
