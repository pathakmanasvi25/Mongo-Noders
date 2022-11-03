const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/signupDB",{useNewUrlParser:true});
var db=mongoose.connection;


app.post("/sign_up",function(req,res){
     var name=req.body.name;
     var email=req.body.email;
     var phno=req.body.phno;
     var password=req.body.password;
     var type=req.body.type;
    
     var data={
        "name":name,
        "email":email,
        "phno":phno,
        "password":password,
        "type":type
     }
     
     db.collection("users").insertOne(data,function(err){
        if(err){
            console.log("error");
        }else{
            console.log("success insertion");
        }
     
    })
   
     res.redirect("/login");
})
app.get("/",function(req,res){
    
     res.sendFile(__dirname+"/public/home.html");
});
app.get("/sign_up",function(req,res){
    res.sendFile(__dirname+"/public/signup.html")
})
app.get("/login",function(req,res){
    res.sendFile(__dirname+"/public/login.html")
})
app.post("/login",async function(req,res){
    var pass=req.body.lpassword;
    var mail=req.body.lemail;
    const data = await db.collection("users").findOne({email:mail});
    const actualPassword = data.password;
    const actualName=data.name;
    if(pass===actualPassword)
    {
        res.send("authenticated");
       
    }
    else{
      res.send("wrongPassword");
    }
    
});
app.listen(3000,function(){
console.log("listening at 3000");
});