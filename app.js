const express=require("express");
const app = express();
const mongoose = require("mongoose");
const Listing= require("./models/listing.js")
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const WrapAsync=require("./utils/wrapAsyc.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./Schema.js")
const Review=require("./models/review.js");
const{reviewSchema}=require("./Schema.js");
const { wrap } = require("module");
const wrapAsyc = require("./utils/wrapAsyc.js");



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

const validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
      if(error){
         let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
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

//index route
app.get("/listing",WrapAsync( async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    
}))

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//show route
app.get("/listings/:id",WrapAsync( async (req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing})
}))

//create route
app.post("/listings",validateListing, WrapAsync(async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing")
} ))

//edit route
app.get("/listings/:id/edit",WrapAsync( async (req,res)=>{
     let {id}=req.params;
    const listing =await Listing.findById(id);
    res.render("listings/edits.ejs",{listing})

}))

//update route
app.put("/listings/:id",validateListing,WrapAsync( async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listing")
}))

//delete route
app.delete("/listing/:id",WrapAsync( async (req,res)=>{
    let {id}=req.params;
    let deletedListing= await  Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    res.redirect("/listing");
} ))

//reviews
//post Review Route
app.post("/listings/:id/reviews", validateReview,WrapAsync(async(req,res)=>{
   let listing= await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);

   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

   console.log("new review is saved")
   res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewID",WrapAsync(async(req,res)=>{
    let{id,reviewID}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
    await Review.findByIdAndDelete(reviewID);

    res.redirect(`/listings/${id}`);
}));



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