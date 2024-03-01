const express = require('express');
const viewsController = require('../controllers/viewsControllers');
const authControllers = require('../controllers/authControllers');
const bookingControllers = require('../controllers/bookingControllers');

const router = express.Router();

router.get(
  '/',
  bookingControllers.createBookingCheckout,
  authControllers.isLoggedIn,
  viewsController.getOverview,
);
router.get('/tour/:slug', authControllers.isLoggedIn, viewsController.getTour);
router.get('/login', authControllers.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authControllers.protect, viewsController.getAccount);
router.get('/my-tours', authControllers.protect, viewsController.getMyTours);

router.post(
  '/submit-user-data',
  authControllers.protect,
  viewsController.updateUserData,
);

module.exports = router;
