const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image: {
  filename: {
    type: String,
    default: "listingimage",
  },
  url: {
    type: String,
    default: "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?v=4",
    set: (v) => v === "" ? "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?v=4" : v,
  },
},

    price:Number,
    location:String,
    country:String,

});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;