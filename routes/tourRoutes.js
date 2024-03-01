/* eslint-disable import/extensions */
const express = require('express');
const tourControllers = require('../controllers/tourControllers.js');
const authControllers = require('../controllers/authControllers.js');
const reviewRouter = require('./reviewRoutes.js');

const app = express();

app.use(express.json());

const router = express.Router();

router.route('/tour-stats').get(tourControllers.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authControllers.protect,
    authControllers.protectTo('admin', 'lead-guide', 'guide'),
    tourControllers.getMonthlyPlan,
  );

// POST /tour/id/reviews
// GET /tour/id/reviews
// GET /tour/id/reviews/review_id

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getTours);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourControllers.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi
router.route('/distances/:latlng/unit/:unit').get(tourControllers.getDistances);

router
  .route('/')
  .get(tourControllers.getTours)
  .post(
    authControllers.protect,
    authControllers.protectTo('admin', 'lead-guide'),
    tourControllers.newTour,
  );

router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(
    authControllers.protect,
    authControllers.protectTo('admin', 'lead-guide'),
    tourControllers.uploadTourImages,
    tourControllers.resizeTourImages,
    tourControllers.updateTour,
  )
  .delete(
    authControllers.protect,
    authControllers.protectTo('admin', 'lead-guide'),
    tourControllers.deleteTour,
  );

// router
//   .route('/:tour_id/reviews')
//   .post(
//     authControllers.protect,
//     authControllers.protectTo('user'),
//     reviewControllers.createReview,
//   );

module.exports = router;
