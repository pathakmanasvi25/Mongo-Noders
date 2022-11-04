const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1/signupDB",{useNewUrlParser:true});
const db=mongoose.connection;


app.post("/sign_up",function(req,res){
     const name=req.body.name;
     const email=req.body.email;
     const phno=req.body.phno;
     const password=req.body.password;
     const type=req.body.type;
    
     const data={
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
     
    });
   
     res.redirect("/login");
})

app.post("/s",function(req,res)
{
    res.redirect("/sign_up");
});
app.post("/l",function(req,res)
{
    res.redirect("/login");
});

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
    const pass=req.body.lpassword;
    const mail=req.body.lemail;
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