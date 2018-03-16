// test.js


it('should aggregate docs from collection', async () => {
  const files = db.collection('files');

  await files.insertMany([
    {type: 'Document'},
    {type: 'Video'},
    {type: 'Image'},
    {type: 'Document'},
    {type: 'Image'},
    {type: 'Document'},
  ]);

  const topFiles = await files
    .aggregate([
      {$group: {_id: '$type', count: {$sum: 1}}},
      {$sort: {count: -1}},
    ])
    .toArray();

  expect(topFiles).toEqual([
    {_id: 'Document', count: 3},
    {_id: 'Image', count: 2},
    {_id: 'Video', count: 1},
  ]);
});

// const mongoose = require('mongoose');

// //global.Promise ES6 standard
// mongoose.Promise = global.Promise;


// // before only execute one time
// beforeAll((done) => {
//     // "/users_test" to specify the database insiede Mongo instance
//     mongoose.connect('mongodb://localhost/users_test');
//     mongoose.connection
//         .once('open', () => {  console.log("db build up !");done(); })
//         .on('error', (error) => {
//             console.warn('Warning', error );
//         });
// });


// beforeEach((done) => {
//     const { users, comments, blogposts } = mongoose.connection.collections;     //mongoDB normalize from "blogPosts" into "blogposts"
//     // Delete users data in DB
//     // No mutli drops at same time in mongoDB
//     users.drop(()=>{
//         comments.drop(() => {
//             blogposts.drop(() => {
//                 done();
//             });
//         });
//     });
// });