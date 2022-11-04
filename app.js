const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
<<<<<<< HEAD
=======
const { application } = require("express");
>>>>>>> 7efb293d6bacd23aebd1391e6faebeaa0b092501
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
<<<<<<< HEAD
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

=======
mongoose.connect("mongodb://localhost:27017/signupDB",{useNewUrlParser:true});
var db=mongoose.connection;

const userSchema=new mongoose.Schema({
    name:{ type:String,
           required:[true,"please fill"]
         },
    email:{ type:String,
            required:[true,"please fill"]
         },
    phno: Number,
    password:String,
    type:String
});
const User=mongoose.model("User",userSchema);

app.post("/sign_up",function(req,res){
   const user=new User({
         name:req.body.name,
         email:req.body.email,
         phno:req.body.phno,
         password:req.body.password,
         type:req.body.type,
   })
    //  var name=req.body.name;
    //  var email=req.body.email;
    //  var phno=req.body.phno;
    //  var password=req.body.password;
    //  var type=req.body.type;
    
    //  var data={
    //     "name":name,
    //     "email":email,
    //     "phno":phno,
    //     "password":password,
    //     "type":type
    //  }
     
    //  db.collection("users").insertOne(data,function(err){
    //     if(err){
    //         console.log("error");
    //     }else{
    //         console.log("success insertion");
    //     }
     
    // })
   user.save();
     res.redirect("/login");
});
app.post("/s",function(req,res){
    res.redirect("/sign_up");
});
app.post("/l",function(req,res){
    res.redirect("/login");
});
>>>>>>> 7efb293d6bacd23aebd1391e6faebeaa0b092501
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
<<<<<<< HEAD
    const pass=req.body.lpassword;
    const mail=req.body.lemail;
=======
    var pass=req.body.lpassword;
    var mail=req.body.lemail;
>>>>>>> 7efb293d6bacd23aebd1391e6faebeaa0b092501
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
<<<<<<< HEAD



=======
>>>>>>> 7efb293d6bacd23aebd1391e6faebeaa0b092501
app.listen(3000,function(){
console.log("listening at 3000");
});