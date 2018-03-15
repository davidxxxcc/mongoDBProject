const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express();

mongoose.Promise = global.Promise;
// seperate testing and developing db
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost:/muber');
}

// middleware function
app.use(bodyParser.json());
routes(app);


// you can call next to force app go to next function
app.use((err, req, res, next) => {
    res.status(422).send({ error: err.message });
});


module.exports = app;