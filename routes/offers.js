const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");
const Offer = require("../models/Offer");

const isAuthenticated = require("../middleware/isAuthenticated");

cloudinary.config({
  cloud_name: "dtmo9vwzh",
  api_key: "549596979995117",
  api_secret: "eNiyq7vRvUwrmXA5VKat0VLwSz0",
});

router.post("/offers/publish", isAuthenticated, async (req, res) => {
  try {
    // il faut valider le token
    const myToken = req.headers.authorization.replace("Bearer ", ""); //PLACER UN REPLACE POUR ENLEVER LE "BEARER "
    const user = await User.findOne({ token: myToken }).select("_id account");

    if (user) {
      const newOffer = new Offer({
        product_name: req.fields.title,
        product_description: req.fields.description,
        product_price: req.fields.price,
        product_details: [
          {
            MARQUE: req.fields.brand,
          },
          {
            TAILLE: req.fields.size,
          },
          {
            ÉTAT: req.fields.condition,
          },
          {
            COULEUR: req.fields.color,
          },
          {
            EMPLACEMENT: req.fields.city,
          },
        ],
      });
      if (req.files.picture) {
        const image = await cloudinary.uploader.upload(req.files.picture.path);

        newOffer.product_image = image;
      }
      await newOffer.save();
      res.json({ newOffer });
    } else {
      res.json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.get("/offers", async (req, res) => {
  try {
    let filters = {};
    if (req.query.title) {
      filters.product_name = new RegExp(req.query.title, "i"); // Bon car on rajoute la clé concernée par la condition (product_name). Appliquer pour chaque action que le client voudra faire dans sa recherche
    }
    //  filters = { product_name: new RegExp(req.query.title, "i") }; // Erroné car on applique déclare que filter EST cette ligne

    if (req.query.priceMax) {
      // filters = product_price = { $lte: Number(req.query.priceMin) };
      filters.product_price = { $lte: Number(req.query.priceMax) };
    }
    const offers = await Offer.find(filters).select(
      "product_name product_price"
    );
    res.json(offers);
    console.log(filters);
    // res.json(offers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
