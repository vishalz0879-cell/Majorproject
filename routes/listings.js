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

router.route("/")
//index route
.get(WrapAsync(listingController.index))
//create route
.post(isLoggedIn,validateListing, WrapAsync(listingController.createListing ));


//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);


router.route("/:id")
//show route
.get(WrapAsync( listingController.showListing))
//update route
.put(isLoggedIn,validateListing,WrapAsync(listingController.UpdateListing))
//delete route
.delete(isLoggedIn,WrapAsync(listingController.DelteListing ));

//edit route
router.get("/:id/edit",isLoggedIn,WrapAsync(listingController.editListing))

module.exports=router;