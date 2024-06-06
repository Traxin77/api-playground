const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"name must be provided"],
    },
    price:{
        type:Number,
        required:[true,"price must be provided"],
    },
    featured:{
        type:Boolean,
        default:false,
    },
    rating:{
        type:Number,
        default: 2.5,
    },
    createdat:{
        type: Date,
        default: Date.now(),
    },
    company:{
        type: String,
        enum:{
            values:["apple","samsung","dell"],
            message:`{VALUE} not supported`,
        },
    },
});

module.exports = mongoose.model('Product',productSchema);