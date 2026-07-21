const express=require("express");
const app = express();
const mongoose = require("mongoose");

main()
.then(()=>{
    console.log("connect to Database")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.get("/",(req,res)=>{
    res.send("hii server is working")
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})