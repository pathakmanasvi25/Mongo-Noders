const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const { application } = require("express");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1/signupDB", { useNewUrlParser: true });
const db = mongoose.connection;

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
    rdate: {
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
    pdate: {
        type: Date,
        //    required:[true]
    },
    rwMavis: {
        type: String,
        required: [true]
    },
    rwMonster: String,
    finalReq: {
        type: String,
        required: [true]
    },
    rating: {
        type: Number,
        required: [true]
    },
    requestedBy: userSchema

});

const Permission = mongoose.model("Permission", permissionSchema);

const managerSchema = new mongoose.Schema({
    mdate: {
        type: Date,
        required: [true]
    },
    adult: {
        type: Number,
        required: true
    },
    children: {
        type: Number,
        required: [true]
    },
    message: String,
    requestBy: userSchema
});

const Manager = mongoose.model("Manager", managerSchema);


app.get("/", function (req, res) {

    res.sendFile(__dirname + "/public/index.html");
});
app.post("/sign_up", function (req, res) {
    const pass = req.body.password;
    const cpass = req.body.cpassword;
    if (pass === cpass) {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phno: req.body.phno,
            password: pass,
            type: req.body.type,
            cpassword: cpass
        });
        user.save();
        if (user.type === "monster") {
            user.id = 3
        } else {
            user.id = 4;
        }
        res.redirect("/");
    }

    else {
        res.write("<h1>password did not match</h1>");
    }
});
app.post("/s", function (req, res) {
    res.sendFile(__dirname + "/public/login.html")
});

var actualId = 0;

app.post("/login", async function (req, res) {
    const pass = req.body.lpassword;
    const mail = req.body.lemail;
    const data = await db.collection("users").findOne({ email: mail });
    const actualPassword = data.password;
    actualName = data.name;
    actualId = data.id;
    if (pass === actualPassword) {

        if (actualId === 3) {

            res.render("monster", { username: actualName, userId: actualId });
        }
        else if (actualId === 4)
            res.render("human", { username: actualName, userId: actualId });

        else if (actualId === 1) {  //dracula's page will open
            Permission.find({}, (err, prems) => {
                if (err) { console.log("error"); }
                res.render("Count", { username: actualName, all: prems });

            });

        }
        else if (actualId === 2) //manager's page will open
        {
            Manager.find({}, (err, mrems) => {
                if (err) { console.log("error"); }
                res.render("manager", { username: actualName, all: mrems });

            });


        }
        else {
            res.send("wrongPassword");
        }
    }
});

app.post("/bookG", async function (req, res) {
    const chosenDate = req.body.date;
    const noOfRooms = req.body.submitG;
    const datad = await db.collection("users").findOne({ name: actualName });
    console.log(T + 100);
    if (actualId === 4 && ((T + 100) > 104))
        res.sendFile(__dirname + "/public/reqDrac.html");
    else {
        var i;
        
            for (i = 1; i <= noOfRooms; i++) {
                //assigning number of rooms they want 
                const addroom = new Room({
                    tor: "General",
                    rdate: chosenDate,
                    bookedBy: datad,
                    roomNo: (100 + ++T)
                });
                await addroom.save();
            }
        }
    }
);

app.post("/bookS", async function (req, res) {
    const datad = await db.collection("users").findOne({ name: actualName });
    const managerReq = new Manager({
        mdate: req.body.date,
        adult: req.body.adultm,
        children: req.body.childm,
        message: req.body.mssg,
        requestBy: datad
    });
    managerReq.save();
});

// app.post("/humang", function (req, res) {
//     // if ((T + 100) < gen){
//     //     res.sendFile(__dirname + "/public/gen.html");

//     // }
//     // else
//         res.sendFile(__dirname + "/public/reqDrac.html");
// });

app.post("/HbookS", async function (req, res) {

    const datad = await db.collection("users").findOne({ name: actualName });
    const specialReq = new Permission({
        pdate: req.body.date,
        rwMavis: req.body.relation,
        rwMonster: req.body.relwm,
        finalReq: req.body.msg,
        rating: req.body.imp,
        requestedBy: datad
    });
    specialReq.save();
});

app.listen(3000, function () {
    console.log("listening at 3000");
});
