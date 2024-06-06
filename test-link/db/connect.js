const mongoose = require("mongoose");


const connectDB = (uri) =>{
    console.log("here");
    return mongoose.connect(uri);
};

module.exports = connectDB;