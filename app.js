const express = require('express')
const app = express();
const bodyparser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const actionLogRoute = require('./api/routes/actionLog');
const userRoute = require('./api/routes/user');
const appConfig = require('./appConfig.js');

const CROSS = true;
//mongodb connect...
//todo:check why not working... app config
mongoose.connect(appConfig.mongo.path , {useMongoClient:true});
mongoose.Promise = global.Promise;


//logger
app.use(morgan('dev'));

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());


app.use((req, res, next) => {
    if (CROSS) {
        res.header('Access-Control-Allow-origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With , Content-Type ,Accept ,Authorization');
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE');
            return res.status(200).json({});
        }
    }
    next();
});


//Routes for the api reqest
app.use('/actionLog', actionLogRoute);
app.use('/users', userRoute);

app.use((req, res, next) => {
    const error = new Error("Requset not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;