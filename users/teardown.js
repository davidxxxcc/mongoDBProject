console.log("=============================DB teardown=============================");

const DataDrop = () => {
    return Promise((resolve, reject) => {
        const { users, comments, blogposts } = mongoose.connection.collections;
        // Delete users data in DB, No mutli drops at same time in mongoDB
        users.drop(() => {
            comments.drop(() => {
                blogposts.drop(() => {
                    resolve;
                });
            });
        });
    });
}
