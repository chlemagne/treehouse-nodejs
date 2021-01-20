const Joi = require('joi');
const config = require('config');
const winston = require('winston');
const express = require('express');
const mongoose = require('mongoose');
const houses = require('./routes/houses');
const users = require('./routes/users');
const auth = require('./routes/auth');
const helmet = require('helmet');
const compression = require('compression');
require('express-async-errors');

const app = express();

/*******************************************************************************
*** START LOGGING
*******************************************************************************/
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ]
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

/*******************************************************************************
*** START ROUTES
*******************************************************************************/
app.use(express.json());
app.use('/api/houses', houses);
app.use('/api/users', users);
app.use('/api/auth', auth);
// add endpoints before this line
app.use(function(err, req, res, next) {
    logger.error(err.message, err);
    res.status(500).send('Something went wrong.');
});

/*******************************************************************************
*** PRODUCTION
*******************************************************************************/
app.use(helmet());
app.use(compression());

/*******************************************************************************
*** START MONGODB
*******************************************************************************/
const db = config.get('db');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(db)
    .then(() => logger.info(`Connected to ${db}...`));

/*******************************************************************************
*** READ CONFIG
*******************************************************************************/

/*******************************************************************************
*** VALIDATION
*******************************************************************************/
Joi.objectId = require('joi-objectid')(Joi);

/*******************************************************************************
*** START APP
*******************************************************************************/
const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`Listening at port ${port}...`));

module.exports = server;
