const assert = require('assert');
const request = require('supertest');
const app = require('../app');


describe('The express app', () => {
    it('handles a GET request to /api', (done) => {
        request(app)        //passing app to supertest library
            .get('/api')    // chain on get request
            .end((err, response) => {
                // console.log(response);
                assert(response.body.hi === 'there');
                done();
            });
    });
});