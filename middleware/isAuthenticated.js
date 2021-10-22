const User = require("../models/User");

//CRÉER FICHIER.JS DÉDIÉ DANS DOSSIER MIDDLEWARE, PUIS A METTRE DANS LA ROUTE PUBLISH EN ENLEVANT LE CODE DOUBLON isTokenValid
const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    });
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).json({ error: "Unauthorized 2" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized 1" });
  }
};

module.exports = isAuthenticated;
