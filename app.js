const express=require("express");
const app = express();
const mongoose = require("mongoose");
const Listing= require("./models/listing.js")
const path=require("path");

main()
.then(()=>{
    console.log("connect to Database")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.send("hii server is working")
})

//index route
app.get("/listing",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    
})

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//show route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
})

//create route
aap.post("/listing",async (res,req)=>{
    let {title,description,image,price,country,location}=req.body;

})




// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"calangut Goa",
//         country:"India",
//     })
//     await sampleListing.save();
//     console.log("sample was saved")
//     res.send("sucessfull testing");
// })

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})