const express = require('express');
const path = require('path');
const app = express();

const userController = require('./controllers/user_controller');
const houseController = require('./controllers/house_controller');
const reserveController = require('./controllers/reserve_controller');
const dashboardController = require('./controllers/dashboard_controller');

const { errorHandler } = require('./middlewares');

app.use(
  '/uploads',
  express.static(path.join(__dirname, '../../uploads'))
);

app.use('/', express.json());
app.use('/users', userController);
app.use('/houses', reserveController, houseController);
app.use('/dashboard', dashboardController);
app.use(errorHandler);

exports.app = app;
