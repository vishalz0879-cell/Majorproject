const Listing=require("../models/listing")


module.exports.index=async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id).populate("reviews").populate("owner");
     if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
     }
     console.log(listing)
    res.render("listings/show.ejs",{listing})
};

module.exports.createListing=async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New listing Created")
    res.redirect("/listings")
};

module.exports.editListing=async (req,res)=>{
     let {id}=req.params;
    const listing =await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edits.ejs",{listing})
};

module.exports.UpdateListing= async (req,res)=>{
    let {id}=req.params;
    
    await Listing.findByIdAndUpdate(id,{...req.body.listing},{ runValidators: true });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.DelteListing= async (req,res)=>{
    let {id}=req.params;
    let deletedListing= await  Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    req.flash("success","Listing is deleted");
    res.redirect("/listings");
};