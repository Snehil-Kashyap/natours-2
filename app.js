/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const errorHandler = require('./controllers/errorControllers');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1.) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// // Set security HTTP headers
// app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));

// Deveopment logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try aagain in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against cross side scripting attacks(XSS)
// app.use(xss());

// Test middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // eslint-disable-next-line no-console
  // console.log(req.cookies);
  next();
});

// Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

//Error Handling For Invalid Routes
app.all('*', (req, res, next) => {
  // const err = new Error(`cannot find ${req.url} on this server`);
  // err.statusCode = 404;
  // err.status = 'Fail';

  next(new AppError(`cannot find ${req.url} on this server`, 404));
});

app.use(errorHandler);

module.exports = app;
