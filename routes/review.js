const express=require("express");
const router=express.Router();
const WrapAsync=require("../utils/wrapAsyc.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const{reviewSchema}=require("../Schema.js");

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


//post Review Route
router.post("/", validateReview,WrapAsync(async(req,res)=>{
   let listing= await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);

   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

   console.log("new review is saved")
   res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
router.delete("/:reviewID",WrapAsync(async(req,res)=>{
    let{id,reviewID}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
    await Review.findByIdAndDelete(reviewID);

    res.redirect(`/listings/${id}`);
}));

module.exports=router;