const express=require("express");
const router=express.Router();
const WrapAsync=require("../utils/wrapAsyc.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../Schema.js");
const Listing= require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");

const listingController=require("../controllers/listings.js");

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
router.get("/",WrapAsync(listingController.index));

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//show route
router.get("/:id",WrapAsync( listingController.showListing));

//create route
router.post("/", isLoggedIn,validateListing, WrapAsync(listingController.createListing ));

//edit route
router.get("/:id/edit",isLoggedIn,WrapAsync(listingController.editListing))

//update route
router.put("/:id",isLoggedIn,validateListing,WrapAsync(listingController.UpdateListing))

//delete route
router.delete("/:id",isLoggedIn,WrapAsync(listingController.DelteListing ));




module.exports=router;