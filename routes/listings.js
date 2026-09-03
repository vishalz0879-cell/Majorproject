const express=require("express");
const router=express.Router();
const WrapAsync=require("../utils/wrapAsyc.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../Schema.js");
const Listing= require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");

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

//index route
router.get("/",WrapAsync( async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    
}))

//new route
router.get("/new",isLoggedIn,(req,res)=>{
   
   
    res.render("listings/new.ejs")
})

//show route
router.get("/:id",WrapAsync( async (req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id).populate("reviews").populate("owner");
     if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
     }
     console.log(listing)
    res.render("listings/show.ejs",{listing})
}))

//create route
router.post("/", isLoggedIn,validateListing, WrapAsync(async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New listing Created")
    res.redirect("/listings")
} ))

//edit route
router.get("/:id/edit",isLoggedIn,WrapAsync( async (req,res)=>{
     let {id}=req.params;
    const listing =await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edits.ejs",{listing})

}))

//update route
router.put("/:id",isLoggedIn,validateListing,WrapAsync( async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing},{ runValidators: true });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}))

//delete route
router.delete("/:id",isLoggedIn,WrapAsync( async (req,res)=>{
    let {id}=req.params;
    let deletedListing= await  Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    req.flash("success","Listing is deleted");
    res.redirect("/listings");
} ))




module.exports=router;