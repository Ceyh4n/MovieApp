const mongoose = require('mongoose'); //database connection codes 



module.exports = ()=>{
    mongoose.connect('mongodb+srv://user1:123abc123@cluster0.w0brm.mongodb.net/movieapi', {
        useNewUrlParser:true,
        useUnifiedTopology: true,
})
    mongoose.connection.on("open",()=>{
        console.log('Mongo Database connection Succesful!');
    });

    mongoose.connection.on("error",()=>{
        console.log('Error!, Mongo Database connection Unsuccesful!');
    })
    mongoose.Promise = global.Promise; // allowing mongoose to use Promises but after update 5.0 this block is not needed.
};