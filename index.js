const winston = require('winston');
const express = require('express');
const demo = require('./routes/demo')
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
app.use('/api/demo', demo)
// add endpoints before this line
app.use(function(err, req, res, next) {
    winston.error(err.message, err);
    res.status(500).send('Something went wrong.');
});

/*******************************************************************************
*** START MONGODB
*******************************************************************************/

/*******************************************************************************
*** READ CONFIG
*******************************************************************************/

/*******************************************************************************
*** START APP
*******************************************************************************/
const port = 3000;
const server = app.listen(port, () => winston.info(`Listening at port ${port}...`));
