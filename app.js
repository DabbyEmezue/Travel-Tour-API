const express = require('express');
const fs = require('fs');
const { get } = require('http');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();
const tourRouter = require('./Routes/tourroutes');
const userRouter = require('./Routes/userroutes');

//1) MIDDLEWARES
app.use(morgan('dev')); //Morgan is for logging. Logging means recording details about each request to t he console which can then be used for other stuff.
app.use(express.json()); //Middleware to modify the incoming request data

app.use((req, res, next) => {
  req.RequestTime = new Date().toISOString(); //toisostring helps us change to a string
  next();
});

//3) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//We are creating a handler for all requests to routes that we have not specified
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); //once we pass in any argument into a next function, express automatcally treats its as an error and carries it to the error handling middleware. Usually has four arguments.
});

//Error Handling middleware

app.use(globalErrorHandler);

//4) START SERVER
module.exports = app;
