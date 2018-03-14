const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 * like this: { all: [artists], count: count, offset: offset, limit: limit }
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
    // Wrtie a query that will follow sort, offset, limit options only
    // do not worry about 'criteria' yet


    const sortOrder = {};
    sortOrder[sortProperty] = 1;
    console.log(criteria);

    const query = Artist.find(buildQuery(criteria))
        .sort({ [sortProperty]: 1 })     //not array  ES6 synax
        .skip(offset)
        .limit(limit);

    return Promise.all([query, Artist.find(buildQuery(criteria)).count()])
        .then((results) => {
            return {
                all: results[0],
                count: results[1],
                offset: offset,
                limit: limit
            }
        })
};

const buildQuery = (criteria) => {
    const query = { };

    if(criteria.name) {
        query.$text = { $search: criteria.name};
    }

    if(criteria.age) {
        query.age = {
            $gte: criteria.age.min,
            $lte: criteria.age.max
        };
    };

    if(criteria.yearsActive) {
        query.yearsActive = {
            $gte: criteria.yearsActive.min,
            $lte: criteria.yearsActive.max
        }
    }

    return query;
};