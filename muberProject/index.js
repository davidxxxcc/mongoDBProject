const app = require('./app');

// listen on any http request from port 3050
app.listen(3050, () => {
    console.log('Running on port 3050');
});