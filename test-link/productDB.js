require("dotenv").config()
const connectDB = require("./db/connect");
const modelDB = require("./models/products");

const productJson = require("./product.json");
const start = async() =>{
    try{
        
        await connectDB(process.env.MONGODB_URL);
        await modelDB.deleteMany();
        await modelDB.create(productJson)
        console.log("yay");
    }catch(error){
        console.log(error);
    }
}
start();