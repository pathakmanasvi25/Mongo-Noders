const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const { application } = require("express");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1/signupDB", { useNewUrlParser: true });
var db = mongoose.connection;
var T=1;
var actualName="";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please fill"]
    },
    email: {
        type: String,
        required: [true, "please fill"]
    },
    phno: {
        type: Number,
        required: [true, "please fill"]
    },
    password: {
        type: String,
        required: [true, "please fill"]
    },
    type: {
        type: String,
        required: [true, "please fill"]
    },
    id: Number,
    cpassword: {
        type: String,
        required: [true, "please fill"]
    }
    
});
const User = mongoose.model("User", userSchema);
const total = 200, gen = 130, special = 70;


const roomSchema = new mongoose.Schema({
    
    tor: {
        type: String, //typeofroom
        required: [true]
    },
    date: {
        type: Date,
        required: [true]
    },
    bookedBy: userSchema,
    roomNo: {
        type: Number,
        required: [true]
    }
});

const Room = mongoose.model("Room", roomSchema);




app.post("/sign_up", function (req, res) {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phno: req.body.phno,
        password: req.body.password,
        type: req.body.type,
        cpassword:req.body.cpassword
    });


    if (user.type === "monster") {
        user.id = 3;
    }
    else
        user.id = 4;

    //    if(user.name==="Count Dracula")
    //    user.id=1;
    //    if(user.name==="Manager")
    //    user.id=2;
    user.save();
    if(user.password===user.cpassword){
        res.redirect("/login");
    }
    else
    {
        res.write("Password did not match");
    }
});


app.post("/s", function (req, res) {
    res.redirect("/sign_up");
});
app.post("/l", function (req, res) {
    res.redirect("/login");
});
app.get("/", function (req, res) {

    res.sendFile(__dirname + "/public/home.html");
});
app.get("/sign_up", function (req, res) {
    res.sendFile(__dirname + "/public/signup.html")
})
app.get("/login", function (req, res) {
    res.sendFile(__dirname + "/public/login.html")
})


app.post("/login", async function (req, res) {
    const pass = req.body.lpassword;
    const mail = req.body.lemail;
    const data = await db.collection("users").findOne({ email: mail });
    const actualPassword = data.password;
    actualName = data.name;
    const actualId = data.id;
    if (pass === actualPassword) {
        
        if(actualId===3){
         
           res.render("monster" , { username: actualName, userId: actualId } );
          }
          else if(actualId===4)
          res.render("human" , { username: actualName, userId: actualId } )
    }
    else {
        res.send("wrongPassword");
    }

});

app.post("/reqg" ,  function(req,res)
{
    res.sendFile(__dirname+"/public/gen.html");
});

app.post("/reqs" ,  function(req,res)
{
    res.sendFile(__dirname+"/public/special.html");
});

app.post("/bookG" , async function(req,res){
    const chosenDate = req.body.date;
    const datad = await db.collection("users").findOne({ name: actualName });
    const addroom=new Room({
        tor:"General",
        date: chosenDate,
        bookedBy: datad,
        roomNo: (100 + ++T)
    });
    addroom.save();

});
app.post("/bookS", function(req,res)
{

});

app.post("/humang" ,  function(req,res)
{
    if((T+100)<gen)
    res.sendFile(__dirname+"/public/gen.html");
    else
    res.sendFile(_dirname + "/public/reqDrac.html");
});

app.post("/HbookS" , function(req,res)
{

    const relationWithMavis=req.body.relation;

    
    function myFunction() {
        // Get the checkbox
        var checkBox = document.getElementById("myCheck");
        // Get the output text
        var text = document.getElementById("text");
      
        // If the checkbox is checked, display the output text
        if (checkBox.checked == true){
          text.style.display = "block";
        } else {
          text.style.display = "none";
        }
      }

      const relationWithMonster= req.body.relwm;
      const request=req.body.finalRequest;


})

app.listen(3000, function () {
    console.log("listening at 3000");
});
