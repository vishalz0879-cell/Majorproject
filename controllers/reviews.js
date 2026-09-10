const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async(req,res)=>{
   let listing= await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);

   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

   console.log("new review is saved")
   res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async(req,res)=>{
    let{id,reviewID}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
    await Review.findByIdAndDelete(reviewID);

    res.redirect(`/listings/${id}`);
};