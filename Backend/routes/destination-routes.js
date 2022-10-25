const express = require("express");
const router = express.Router();

const Destination = require("../models/destination"); //Destination Model

//Fetches all destinations against the given username
router.get("/", (req, res) => {
  console.log(req);
  const username = req.query.username;
  console.log("sndfk", username);
  Destination.find({ username: username }, (err, data) => {
    if (err) {
      res.json({
        success: false,
        message: `Error: ${err}`,
      });
    } else {
      res.json({
        success: true,
        message: "data fetched successfully",
        destinations: data,
      });
    }
  });
});

//To insert an object
router.post("/", (req, res) => {
  const username = req.body.destination.username;
  const address = req.body.destination.address;
  const description = req.body.destination.description;
  const latitude = req.body.destination.latitude;
  const longitude = req.body.destination.longitude;

  const destToAdd = new Destination({
    username,
    address,
    description,
    latitude,
    longitude,
  });

  Destination.findOne({
    username: username,
    latitude: latitude,
    longitude: longitude,
  }).then((destination) => {
    if (!destination) {
      destToAdd
        .save()
        .then((destination) => {
          res.json({
            success: true,
            message: "Destination added successfully.",
            data: destination,
          });
        })
        .catch((err) => {
          res.json({
            success: false,
            message: `Error: ${err}`,
          });
        });
    } else {
      res.json({
        success: false,
        message: "A destination with the same coordinates already exists",
        description: "repeat",
      });
    }
  });
});

//to update an object
router.put("/", (req, res) => {
  const id = req.body.destination._id;
  const username = req.body.destination.username;
  const address = req.body.destination.address;
  const description = req.body.destination.description;
  const latitude = req.body.destination.latitude;
  const longitude = req.body.destination.longitude;

  const filter = { _id: id, username: username };
  const update = {
    username: username,
    address: address,
    description: description,
    latitude: latitude,
    longitude: longitude,
  };

  Destination.findOneAndUpdate(
    filter,
    update,
    {
      new: true,
    },
    (err, data) => {
      if (err) {
        res.json({
          success: false,
          message: `Error: ${err}`,
        });
      } else {
        res.json({
          success: true,
          message: "destination updated successfully",
          data: data,
        });
      }
    }
  );
});

//delete a destination item
router.delete("/", (req, res) => {
  const id = req.query.id;

  const filter = { _id: id };

  Destination.findOneAndDelete(filter, (err, doc) => {
    if (err) {
      res.json({
        success: false,
        message: `Error: ${err}`,
      });
    } else {
      res.json({
        success: true,
        message: "destination deleted successfully",
        data: doc,
      });
    }
  });
});

module.exports = router;
