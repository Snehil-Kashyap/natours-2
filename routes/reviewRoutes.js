const express = require('express');
const reviewControllers = require('../controllers/reviewControllers');
const authControllers = require('../controllers/authControllers');

// const app = express();

// app.use(express.json());

const router = express.Router({ mergeParams: true });

router.use(authControllers.protect);

router
  .route('/')
  .get(reviewControllers.getAllReviews)
  .post(
    authControllers.protectTo('user'),
    reviewControllers.setTourUserIds,
    reviewControllers.createReview,
  );

router
  .route('/:id')
  .get(reviewControllers.getReview)
  .patch(
    authControllers.protectTo('user', 'admin'),
    reviewControllers.updateReview,
  )
  .delete(
    authControllers.protectTo('user', 'admin'),
    reviewControllers.deleteReview,
  );
// router.route('/:id').get();

module.exports = router;
