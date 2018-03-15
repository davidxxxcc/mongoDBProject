const DriversController = require('../controllers/drivers_controller');

module.exports = (app) =>{
    // Watch for incoming requrests of method GET to the route http://localhost:3050/api
    // specify the route "/api" from http get request
    // req: incoming request, res: response
    app.get('/api', DriversController.greeting);

    app.post('/api/drivers', DriversController.create);

    //put driver id in url
    app.put('/api/drivers/:id', DriversController.edit);    //e.g. /api/dirvers/asldkfjlkdsajf
    
    app.delete('/api/drivers/:id', DriversController.delete);

    app.get('api/drivers', DriversController.index);
}