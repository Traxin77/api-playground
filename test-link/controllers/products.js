const Product = require("../models/products");

const getAllProducts = async(req,res)=>{
    const { company,name,featured,sort,select } =req.query;
    const simplequery = {};
    if(company){
        simplequery.company = {$regex:company,$options:"i"};
    }
    if(featured){
        simplequery.featured = featured;
    }
    if(name){
        simplequery.name= {$regex: name,$options:"i"};
    }
    let apiData = Product.find(simplequery);
    if(sort){
        let sortfix = sort.split(",").join(" ");
        apiData = apiData.sort(sortfix)
    }
    if(select){
        let selectfix = select.split(",").join(" ");

        apiData = apiData.select(selectfix);
    }
    let page =Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 5;
    let skip = (page -1)* limit;
    apiData = apiData.skip(skip).limit(limit);
    const mydata = await apiData;
    res.status(200).json({mydata ,nbHits: mydata.length});
};

const getAllProductsTesting = async(req,res)=>{
    res.status(200).json({msg: "All products testing"})
};
module.exports = {getAllProducts,getAllProductsTesting}