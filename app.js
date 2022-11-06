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
var T = 1;
var actualName = "";
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

const permissionSchema = new mongoose.Schema({
       date: {type: Date,
        required: [true]},
    rwMavis: {
       type: String,
        required: [true]
    },
    rwMonster: String ,
    finalReq: {
        type: String,
        required: [true]
    },
    rating: {
       type:  Number,
        required: [true]
    },
    requestedBy: userSchema

});

const Permission = mongoose.model("Permission", permissionSchema);

const managerSchema = new mongoose.Schema({
    date: {type: Date,
        required: [true]},
    adult: {
      type:  Number,
        required:true
    },
    children: {
       type:  Number,
        required: [true]
    },
    message:  String,
    requestBy: userSchema
});

const Manager = mongoose.model("Manager", managerSchema);

app.post("/sign_up", function (req, res) {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phno: req.body.phno,
        password: req.body.password,
        type: req.body.type,
        cpassword: req.body.cpassword
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
    if (user.password === user.cpassword) {
        res.redirect("/login");
    }
    else {
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

        if (actualId === 3) {

            res.render("monster", { username: actualName, userId: actualId });
        }
        else if (actualId === 4)
            res.render("human", { username: actualName, userId: actualId });
        else if (actualId === 1){
            Permission
            res.render("Count", { username: actualName, userId: actualId });
        }
        else if (actualId === 2)
            res.render("manager", { username: actualName, userId: actualId });
        
        
        }
    else {
        res.send("wrongPassword");
    }

});

app.post("/reqg", function (req, res) {
    res.sendFile(__dirname + "/public/gen.html");
});

app.post("/reqs", function (req, res) {
    res.sendFile(__dirname + "/public/special.html");
});

app.post("/bookG", async function (req, res) {
    const chosenDate = req.body.date;
    const datad = await db.collection("users").findOne({ name: actualName });
    const addroom = new Room({
        tor: "General",
        date: chosenDate,
        bookedBy: datad,
        roomNo: (100 + ++T)
    });
    addroom.save();

});
app.post("/bookS", async function (req, res) {
    const datad = await db.collection("users").findOne({ name: actualName });
    const managerReq = new Manager({
        date:req.body.date,
        adult: req.body.adultm,
        children: req.body.childm,
        message: req.body.mssg,
        requestBy:datad
    });
    managerReq.save();
});

app.post("/humang", function (req, res) {
    if ((T + 100) < gen)
        res.sendFile(__dirname + "/public/gen.html");
    else
        res.sendFile(_dirname + "/public/reqDrac.html");
});

app.post("/HbookS", async function (req, res) {


    function myFunction() {
        // Get the checkbox
        var checkBox = document.getElementById("myCheck");
        // Get the output text
        var text = document.getElementById("text");

        // If the checkbox is checked, display the output text
        if (checkBox.checked == true) {
            text.style.display = "block";
        } else {
            text.style.display = "none";
        }
    }

    const datad = await db.collection("users").findOne({ name: actualName });
    const specialReq = new Permission({
        date:req.body.date,
        rwMavis: req.body.relation,
        rwMonster: req.body.relwm,
        finalReq: req.body.finalRequest,
        rating: req.body.imp,
        requestedBy:datad
    });
    specialReq.save();
})

app.listen(3000, function () {
    console.log("listening at 3000");
});
