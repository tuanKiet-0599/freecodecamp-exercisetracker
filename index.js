const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

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
  console.log(user);
  const exerciseObj = await Exercise({
    user_id: user._id,
    duration: +req.body.duration,
    date: req.body.date ? new Date(req.body.date) : new Date(),
    description: req.body.description,
  });
  const exercise = await exerciseObj.save();
  delete exercise.user_id;
  res.json({
    ...exercise,
    date: exercise.date.toDateString(),
  });
});

// app.get("/api/users/:_id/logs", async (req, res) => {
//   // const { limit } = req.query;
//   const to = req.query.to ? new Date(req.query.to) : new Date(8640000000000000);
//   const from = req.query.from
//     ? new Date(req.query.from)
//     : new Date(-8640000000000000);
//   // console.log(new Date(undefined));
//   let date = {};
//   if (to) {
//     date.$lte = to;
//   }
//   if (from) {
//     date.$gte = from;
//   }

//   const userActivitiesList = await users
//     .find({
//       _id: new ObjectId(req.params._id),
//     })
//     .toArray();
//   // .limit(+limit)
//   // if (from || to) {
//   //   userActivitiesList
//   //     .filter({
//   //       date,
//   //     })
//   //     .toArray();
//   // }
//   // userActivitiesList.toArray();
//   const { username, _id } = userActivitiesList[0];
//   const newList = userActivitiesList
//     .filter((item) => {
//       if (new Date(item.date) >= from && new Date(item.date) <= to) {
//         return item;
//       }
//     })
//     .map((item) => {
//       delete item._id;
//       delete item.username;
//       return item;
//     });

//   const result = {
//     username,
//     _id,
//     count: userActivitiesList.length,
//     log: [...newList],
//   };
//   // console.log(result);
//   res.json(result);
//   // if (limit) {
//   //   console.log("has limit");
//   //   const userActivitiesList = await users
//   //     .find({
//   //       _id: new ObjectId(req.params._id),
//   //     })
//   //     .limit(+limit)
//   //     .toArray();
//   //   const { username, _id } = userActivitiesList[0];
//   //   const newList = userActivitiesList
//   //     .filter((item) => {
//   //       if (new Date(item.date) >= from && new Date(item.date) <= to) {
//   //         return item;
//   //       }
//   //     })
//   //     .map((item) => {
//   //       delete item._id;
//   //       delete item.username;
//   //       return item;
//   //     });

//   //   const result = {
//   //     username,
//   //     _id,
//   //     count: userActivitiesList.length,
//   //     log: [...newList],
//   //   };
//   //   console.log(result);
//   //   res.json(result);
//   // } else {
//   //   const userActivitiesList = await users
//   //     .find({
//   //       _id: new ObjectId(req.params._id),
//   //     })
//   //     .toArray();
//   //   const { username, _id } = userActivitiesList[0];
//   //   const newList = userActivitiesList
//   //     .filter((item) => {
//   //       if (new Date(item.date) <= from) {
//   //         console.log(true);
//   //         return item;
//   //       } else {
//   //         console.log(false);
//   //       }
//   //     })
//   //     .map((item) => {
//   //       delete item._id;
//   //       delete item.username;
//   //       return item;
//   //     });

//   //   const result = {
//   //     username,
//   //     _id,
//   //     count: userActivitiesList.length,
//   //     log: [...newList],
//   //   };
//   //   console.log(result);
//   //   res.json(result);
//   // }
// });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
