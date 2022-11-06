const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
const { application } = require("express");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1/signupDB",{useNewUrlParser:true});
const db=mongoose.connection;

const userSchema=new mongoose.Schema({
    
    name:{ type:String,
           required:true,
           unique:true
         },
    email:{ type:String,
            required:true,
            unique:true
         },
    phno: Number,
    password:{ type:String,
               required:true,
             },
    cpassword:{ type:String,
                required:true,
              },         
    type:String,
    id:Number
});
const User=mongoose.model("User",userSchema);

app.get("/",function(req,res){
    
    res.sendFile(__dirname+"/public/home.html");
});
app.post("/sign_up",function(req,res){
   const pass=req.body.password;
  const cpass=req.body.cpassword;
  if(pass===cpass){
    const user=new User({
         name:req.body.name,
         email:req.body.email,
         phno:req.body.phno,
         password:pass,
         type:req.body.type,
         cpassword:cpass
   });
   user.save();
   if(user.type==="monster"){
    user.id=3
   }else{
    user.id=4;
   }
      res.redirect("/");
 }

     else{
           res.write("<h1>password did not match</h1>");
     }
 });
app.post("/s",function(req,res){
    res.sendFile(__dirname+"/public/login.html")
});



app.post("/login", async function(req,res){
    const pass=req.body.lpassword;
    const mail=req.body.lemail;
    const data = await db.collection("users").findOne({email:mail});
    if(data==null){
        res.write("invalid user")
    }
 
    const actualPassword = data.password;
    const actualName=data.name;
    const actualId=data.id;
    if(pass===actualPassword)
    {
        res.render("index",{userName: actualName,userId: actualId});
         
    }
    else{
      res.send("wrongPassword");
    }
    
});
app.listen(3000,function(){
console.log("listening at 3000");
});