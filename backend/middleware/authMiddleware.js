const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  try {
    // dans la fonction où il ya une definition des cookies si on tape
    // console.log(req) on trouvera cookies.token comme reponse
    // 1- recuperer le token
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not autorized, please login");
    }
    // 2- verify validity of token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(verified) => { id: '64bbe15851711439185a8ce2', iat: 1690134520, exp: 1690998520 }
    // 3- get the user
    const user = await User.findById(verified.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
    // les données de l'utilisateur sont transmise à la fonction suivante lié a cette fonction
    req.user = user;
    next();
  } catch (error) {
    res.status(401)
    throw new Error("Not authorized, please login")
  }
});

module.exports = protect;
