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
    id: Number
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
    });


    if (user.type === "Monster") {
        user.id = 3;
    }
    else
        user.id = 4;

    //    if(user.name==="Count Dracula")
    //    user.id=1;
    //    if(user.name==="Manager")
    //    user.id=2;
    user.save();
    res.redirect("/login");
});


app.post("/index" , function(req,res)
{

    const chosenDate = req.body.date;
    const userid=user.id;
    const newroom=new Room(
        {
            if(userid===3)
        }
    )
})
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
    const actualName = data.name;
    const actualId = data.id;
    if (pass === actualPassword) {
        res.render("index", { username: actualName, id: actualId });

    }
    else {
        res.send("wrongPassword");
    }

});
app.listen(3000, function () {
    console.log("listening at 3000");
});
