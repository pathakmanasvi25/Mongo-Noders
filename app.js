const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const { application } = require("express");
// const encrypt=require("mongoose-encryption");
const md5 = require("md5");
const { BulkOperationBase } = require("mongodb");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1/hotelDB", { useNewUrlParser: true });
const db = mongoose.connection;

var T = 1;
var actualName = "";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please fill"],
  },
  email: {
    type: String,
    required: [true, "please fill"],
  },
  phno: {
    type: Number,
    required: [true, "please fill"],
  },
  password: {
    type: String,
    required: [true, "please fill"],
  },
  type: {
    type: String,
    required: [true, "please fill"],
  },
  id: Number,
  cpassword: {
    type: String,
    required: [true, "please fill"],
  },
});

const User = mongoose.model("User", userSchema);

const roomSchema = new mongoose.Schema({
  tor: {
    type: String, //typeofroom
    required: [true],
  },
  rindate: {
    type: Date
  },
  routdate: {
    type: Date
  },
  bookedBy: userSchema,
  roomNo: {
    type: Number,
    required: [true]
  },
});

const Room = mongoose.model("Room", roomSchema);

const permissionSchema = new mongoose.Schema({
  pindate: {
    type: Date
  },
  poutdate: {
    type: Date
  },
  rwMavis: {
    type: String,
    required: true
  },
  finalReq: {
    type: String,
    required: [true]
  },

  requestedBy: userSchema,
});

const Permission = mongoose.model("Permission", permissionSchema);

const managerSchema = new mongoose.Schema({
  mindate: {
    type: Date
  },
  moutdate: {
    type: Date
  },
  adult: {
    type: Number,
    required: true,
  },
  message: {
    type: String
  },
  requestBy: userSchema
});

const Manager = mongoose.model("Manager", managerSchema);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/sign_up", async function (req, res) {
  const enteredMail = req.body.email;
  const enteredName = req.body.name;
  const newUsere = await db.collection("users").findOne({ email: enteredMail });
  const newUsern = await db.collection("users").findOne({ name: enteredName });
  const pass = md5(req.body.password); //hashing password
  const cpass = md5(req.body.cpassword); //hashing confirm password
  if (!newUsere && !newUsern) {
    if (pass === cpass) {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        phno: req.body.phno,
        password: pass,
        type: req.body.type,
        cpassword: cpass,
      });

      if (user.type === "monster") {
        user.id = 3;
      } else {
        user.id = 4;
      }
      await user.save(); //saving new user in user collection
      res.render("error", {
        message: "You are registered Succesfully",
        error: "",
      });
    }
    res.render("error", {
      message: "",
      error: "Password and confirm password do not match",
    });
  } else if (!newUsere && newUsern) {
    res.render("error", {
      message: "",
      error: "this UserName is already registered with us ",
    });
  } else if (newUsere && newUsern) {
    res.render("error", {
      message: "",
      error: "this Email and User Name is already registered with us ",
    });
  } else if (newUsere && !newUsern) {
    res.render("error", {
      message: "",
      error: "this Email is already registered with us ",
    });
  }
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/public/login.html");
});

app.get("/fpass",function(req,res){
  res.render("error",{message:"This feature will be incorporated Shortly",error:""});
});

app.post("/s", function (req, res) {
  res.sendFile(__dirname + "/public/login.html");
});

app.post("/backa", function (req, res) {
  res.redirect("/login");
});

app.post("/backd", function (req, res) {
  res.redirect("/");
});

app.post("/login", async function (req, res) {
  const pass = md5(req.body.lpassword); //hashing the entered password
  const mail = req.body.lemail;
  const data = await db.collection("users").findOne({ email: mail });
  if (data) {
    const actualPassword = data.password;
    actualName = data.name;
    actualId = data.id;
    if (pass === actualPassword) {
      //comparing both hashed password

      if (actualId === 3) {
        res.render("monster", { username: actualName });
      } else if (actualId === 4) res.render("human", { username: actualName });
      else if (actualId === 1) {
        //Count Dracula's ID
        Permission.find({}, (err, prems) => {
          if (err) {
            console.log("error");
          }
          res.render("Count", { username: actualName, all: prems });
        });
      } else if (actualId === 2) {
        //manager's ID
        Manager.find({}, (err, mrems) => {
          if (err) {
            console.log("error");
          }
          res.render("manager", { username: actualName, all: mrems });
        });
      }
    } else {
      res.render("error", { message: "", error: "Wrong Password" });
    }
  } else {
    res.render("error", { message: "", error: "No user Found" });
  }
});


app.post("/bookG", async function (req, res) {
  const choseninDate = req.body.indate;
  const chosenoutDate = req.body.outdate;
  const noOfRooms = req.body.submitG;
  const datad = await db.collection("users").findOne({ name: actualName });
  if (actualId === 4 && T + 100 > 104) 
    //condition if user is a hauman and needs a special room in case all general rooms are occupied
    res.render("reqDrac", { username: actualName });
  else {
    for (var i = 0; i < noOfRooms; i++) {
      const addroom = new Room({
        tor: "General",
        rindate: choseninDate,
        routdate: chosenoutDate,
        bookedBy: datad,
        roomNo: 100 + ++T,
      });
      await addroom.save();
    }
    res.redirect("/yourb");
  }
});

app.post("/bookS", async function (req, res) {
  const datadm = await db.collection("users").findOne({ name: actualName });
  const managerReq = new Manager({
    mindate: req.body.indate,
    moutdate: req.body.outdate,
    adult: req.body.adultm,
    message: req.body.mssg,
    requestBy: datadm,
  });
  console.log(managerReq.message);
  await managerReq.save();
  res.redirect("/yourb"); //redirection after requesting manager for special room
});

app.post("/HbookS", async function (req, res) {
  const datad = await db.collection("users").findOne({ name: actualName });
  const specialReq = new Permission({
    pindate: req.body.indate,
    poutdate: req.body.outdate,
    rwMavis: req.body.relation,
    finalReq: req.body.msg,
    requestedBy: datad,
  });
  await specialReq.save();
  res.redirect("/yourb"); 
});
app.post("/list", function (req, res) {
  Room.find({}, (err, prems) => {
    if (err) {
      console.log("error");
    }
    res.render("guest", { username: actualName, all: prems });
  });
});
app.post("/reqaccD/:tail", async function (req, res) {
  console.log("req accepted by dracula ");
  console.log(req.params.tail);
  const rel = req.params.tail;
  const perr = await db.collection("permissions").findOne({ rwMavis: rel });
  console.log(perr);

  const addroomS = new Room({
    tor: "Special",
    rindate: perr.pindate,
    routdate: perr.poutdate,
    bookedBy: perr.requestedBy,
    roomNo: 100 + ++T,
  });
  await addroomS.save();
  //  console.log(addroomS);
  db.collection("permissions").deleteOne({ rwMavis: rel });
  Permission.find({}, (err, premsm) => {
    if (err) {
      console.log("error");
    }
    res.render("count", { username: actualName, all: premsm });
  });
});

app.post("/reqaccM/:key", async function (req, res) {
  console.log("request accepted by manager");
  console.log(req.params.key);
  const rel = req.params.key;
  const manr = await db.collection("managers").findOne({ message: rel });
  console.log(manr);

  const addroomSM = new Room({
    tor: "Special",
    rindate: manr.mindate,
    routdate: manr.moutdate,
    bookedBy: manr.requestBy,
    roomNo: 100 + ++T
  });
  await addroomSM.save();
  db.collection("managers").deleteOne({ message: rel });
  Manager.find({}, (err, premsm) => {
    if (err) {
      console.log("error");
    }
    res.render("manager", { username: actualName, all: premsm });
  });
});
app.get("/yourb", function (req, res) {
  Room.find({}, (err, prems) => {
    if (err) {
      console.log("error");
    }
    res.render("book", { username: actualName, all: prems });
  });
});

app.get("/list", function (req, res) {
  Room.find({}, (err, prems) => {
    if (err) {
      console.log("error");
    }
    res.render("guest", { username: actualName, all: prems });
  });
});

app.listen(3000, function () {
  console.log("listening at 3000");
});
