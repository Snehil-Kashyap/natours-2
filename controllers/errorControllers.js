/* eslint-disable no-unused-vars */
const AppError = require('../utils/appError');

/* eslint-disable no-console */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err, req) => {
  const message = `Duplicate field value: "${req.body.name}". Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = errors.join('. ');

  return new AppError(message, 400);
};

const handleJWTerror = () =>
  new AppError('Invalid token, please login again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired, please login again', 401);

const sendDevError = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // RENDERED WEBSITE

  console.log('ERROR! : ', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendProdError = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // A.) API
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B.) Programming or other unknow error: don't leak error details
    // 1) Log error
    console.error('Error! : ', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // B.) RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  //Programming or other unknow error: don't leak error details
  // 1) Log error
  console.error('Error! : ', err);

  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, req, res);
  } else if (process.env.NODE_ENV === 'production ') {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error, req);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTerror(error);
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError(error);

    sendProdError(error, req, res);
  }
};
