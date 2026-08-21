const express=require("express");
const app = express();
const mongoose = require("mongoose");
const Listing= require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const WrapAsync=require("./utils/wrapAsyc.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./Schema.js");
const Review=require("./models/review.js");
const{reviewSchema}=require("./Schema.js");
const { wrap } = require("module");
const wrapAsyc = require("./utils/wrapAsyc.js");



const listings = require("./routes/listings.js");
const reviews =require("./routes/review.js");


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
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("hii server is working")
})


const validateReview=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
      if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.all("*splat",(req,res,next)=>{
    next(new ExpressError(404,"Page not exist"))
    
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{message})
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})