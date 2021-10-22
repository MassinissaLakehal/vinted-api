const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

mongoose.connect("mongodb://localhost/vinted");

cloudinary.config({
  cloud_name: "dtmo9vwzh",
  api_key: "549596979995117",
  api_secret: "eNiyq7vRvUwrmXA5VKat0VLwSz0",
});

const app = express();
app.use(formidable());

const userRoutes = require("./routes/users");
app.use(userRoutes);
const offerRoutes = require("./routes/offers");
app.use(offerRoutes);

app.all("*", (req, res) => {
  res.json("Page not found");
});

app.listen(3000, () => {
  console.log("Server has started");
});
