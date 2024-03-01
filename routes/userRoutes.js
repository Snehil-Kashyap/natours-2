const express = require('express');
const userControllers = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');
// const reviewControllers = require('../controllers/reviewControllers');

const router = express.Router();

router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);
router.get('/logout', authControllers.logout);
router.post('/forgotPassword', authControllers.forgotPassword);
router.patch('/resetPassword/:token', authControllers.resetPassword);

// Protect all routes after this middleware
router.use(authControllers.protect);

router.patch('/updateMyPassword', authControllers.updatePassword);
router.get('/me', userControllers.getMe, userControllers.getUser);
router.patch(
  '/updateMe',
  userControllers.uploadUserPhoto,
  userControllers.resizeUserPhoto,
  userControllers.updateMe,
);
router.delete('/deleteMe', userControllers.deleteMe);

router.use(authControllers.protectTo('admin'));

router.route('/').get(userControllers.getUsers);

router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
