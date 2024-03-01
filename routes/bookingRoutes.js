const express = require('express');
const bookingControllers = require('../controllers/bookingControllers');
const authControllers = require('../controllers/authControllers');

// const app = express();

// app.use(express.json());

const router = express.Router();

router.use(authControllers.protect);

router.get(
  '/checkout-session/:tourID',
  authControllers.protect,
  bookingControllers.getCheckoutSession,
);

router.use(authControllers.protectTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingControllers.getAllBookings)
  .post(bookingControllers.createBooking);

router
  .route('/:id')
  .get(bookingControllers.getBooking)
  .patch(bookingControllers.updateBooking)
  .delete(bookingControllers.deleteBooking);

module.exports = router;
