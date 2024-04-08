const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.connect("mongodb://localhost:27017/exercise-tracker");
const UserSchema = new Schema({
  username: String,
});

const User = mongoose.model("User", UserSchema);
const ExerciseSchema = new Schema({
  user_id: { type: String, required: true },
  description: String,
  duration: Number,
  date: Date,
});
const Exercise = mongoose.model("Exercise", ExerciseSchema);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
  const userObj = User({
    username: req.body.username,
  });
  const user = await userObj.save();
  res.json(user);
});
app.get("/api/users", async (req, res) => {
  const usersList = await User.find({});
  res.send(usersList);
});
app.post("/api/users/:_id/exercises", async (req, res) => {
  const user = await User.findById({ _id: req.params._id });
  const exerciseObj = await Exercise({
    user_id: user._id,
    duration: +req.body.duration,
    date: req.body.date ? new Date(req.body.date) : new Date(),
    description: req.body.description,
  });
  const exercise = await exerciseObj.save();
  res.json({
    _id: exercise.user_id,
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date.toDateString(),
  });
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const { limit } = req.query;
  let dateObj = {};
  const { to, from } = req.query;
  if (to) {
    dateObj.$lte = new Date(to);
  }
  if (from) {
    dateObj.$gte = new Date(from);
  }
  const user = await User.findById({
    _id: req.params._id,
  });
  let filter = {
    user_id: user._id,
  };
  if (from || to) {
    filter.date = dateObj;
  }

  const exercises = await Exercise.find(filter)
    .limit(+limit ?? 1000)
    .select({ duration: 1, date: 1, description: 1 })
    .lean();
  const log = exercises.map((item) => {
    item.date = item.date.toDateString();
    delete item._id;
    return item;
  });
  const result = {
    username: user.username,
    _id: user._id,
    count: exercises.length,
    log,
  };
  res.json(result);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
