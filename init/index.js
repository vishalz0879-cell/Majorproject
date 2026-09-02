const mongoose = require("mongoose");
const initdata = require("./data.js")
const Listing=require("../models/listing.js")

main()
.then(()=>{
    console.log("connect to Database")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB= async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner: '6a9520619a98235d1f176c8d'}));
    await Listing.insertMany(initdata.data)
    console.log("data was initalized")
};

initDB();

