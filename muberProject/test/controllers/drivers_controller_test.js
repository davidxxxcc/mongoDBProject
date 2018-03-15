const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const Driver = mongoose.model('driver');


describe('Drivers controller', () => {

    it('POST to /api/drivers creates a new driver', done => {
        Driver.count().then(count => {
            request(app)
                .post('/api/drivers')       //crrate post request
                .send({ email: 'test@test.com' }) //send to server
                .end(() => {
                    Driver.count().then(newCount => {
                        assert(count + 1 === newCount);
                        done();
                    })
                });
        });
    });

    it('PUT to /api/drivers/id edits an exsiting dirver', done => {
        const driver = new Driver({ email:'t@t.com', driving: false });

        driver.save().then(() => {
                request(app)
                    .put(`/api/drivers/${driver._id}`)
                    .send({ driving: true })
                    .end(() => {
                        Driver.findOne({ email: 't@t.com'})
                            .then(driver => {
                                assert(driver.driving === true);
                                done();
                            });
                    });
        });
    });

    it('DELETE to /api/drivers/id candelte a driver', done => {
        const driver = new Driver({ email: 'test@test.com'});

        driver.save().then(() => {
            request(app)
                .delete(`/api/drivers/${driver._id}`)
                .end(() => {
                    Driver.findOne({ email: 'test@test.com'})
                        .then((driver) => {
                            assert(driver === null);
                            done();
                        })
                })
        });
    });

    it('GET to /api/drivers finds drivers in a location', done=> {
        const seattleDriver = new Driver({
            email: 'seattle@test.com',
            geomtry: { type: 'Point', coordinates: [-122.4659902, 47.61477628]}
        });

        const miamiDriver = new Driver({
            email: 'miami@test.com',
            geomtry: { type: 'Point', coordinates: [-80.253, 25.791]}
        });

        Promise.all([ seattleDriver.save(), miamiDriver.save()])
            .then(() =>{
                request(app)
                    .get('/api/drivers?lng=-80&lat=25')
                    .end((err, response) => {
                        console.log(response);
                        assert(response.body.length === 1);
                        assert(response.body[0].obj.email === 'miami@test.com');
                        done();
                    })
            })
    })
});
