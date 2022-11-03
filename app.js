//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require('mongoose');
const DB="mongodb+srv://pathakmanasvi25:Manasvi%4025@cluster0.zkvzbkm.mongodb.net/hotelDB?retryWrites=true&w=majority";

mongoose.connect(DB,{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true
    // useFindAndModify:false
}).then(()=>{
    console.log("success");
}).catch((err) => console.log(err));
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });