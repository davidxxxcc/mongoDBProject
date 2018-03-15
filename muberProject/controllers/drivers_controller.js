const Driver = require('../models/driver');

module.exports = {
    greeting(req, res) {
        res.send({ hi: 'there' });
    },

    index(req, res, next) {
        const {lng, lat} = req.query;   //query string on URL
        // e.g. 'http://google.com?lng=80&lat=20'
     
        Driver.find({
            'geometry.coordinates': {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: 200000
                }
            }
        })
            .then(drivers => res.send(drivers))
            .catch(next);
    },

    create(req, res, next) {
        const driverProps = req.body;
        //'create' makes instantiates and persists the record to the DB with a single call, 
        // whereas 'save' is used on an existing instance of a model.  
        // 'Save' is best used if you want to do some computation or validation prior to saving it.
        Driver.create(driverProps)      //create() from mongoose
            .then(driver => res.send(driver))
            .catch(next);
    },

    edit(req, res, next) {
        //app.put('/api/drivers/:id', DriversController.edit);
        const driverId = req.params.id;
        const driverProps = req.body;

        Driver.findByIdAndUpdate({ _id: driverId }, driverProps )
            .then(() => Driver.findById({ _id: driverId }))
            .then(driver => res.send(driver))
            .catch(next);
    },

    delete(req, res, next) {
        const driverId = req.params.id;

        Driver.findByIdAndRemove({ _id: driverId })
            .then(driver => res.status(204).send(driver))
            .catch(next);
    }

    
}