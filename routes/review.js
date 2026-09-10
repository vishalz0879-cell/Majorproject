const express=require("express");
const Listing = require("../models/listing.js");
const router=express.Router({mergeParams:true});//Revise it bro 
const WrapAsync=require("../utils/wrapAsyc.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const{reviewSchema}=require("../Schema.js");

const reviewControler=require("../controllers/reviews.js")

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
router.post("/", validateReview,WrapAsync(reviewControler.createReview));

//Delete Review Route
router.delete("/:reviewID",WrapAsync(reviewControler.destroyReview));

module.exports=router;