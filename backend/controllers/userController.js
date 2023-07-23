const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');

const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const cookie = require("../utils/cookie");

// @desc   Register User
// @route  POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  // Check if user email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  // Create new user
  const user = await User.create({ name, email, password });

  // Generate the JWT token
  // const token = generateToken(user._id);
  const token = generateToken(user._id);

  // Send the HTTP-only cookie
  cookie(res, token, new Date(Date.now() + 1000 * 84600)); // le cookie valable un jour

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc   Login User
// @route  POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter email and password");
  }
  // Check if user exist
  const user = await User.findOne({ email: req.body.email }); // on va pas utilser la restruction juste pour motif de clareté
  if (!user) {
    res.status(404);
    throw new Error("Invalid email or password");
  }
  // User exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!passwordIsCorrect) {
    res.status(404);
    throw new Error("Invalid email or password");
  }

  if (passwordIsCorrect) {
    const token = generateToken(user._id);
    // Send the HTTP-only cookie
    cookie(res, token, new Date(Date.now() + 1000 * 84600)); // le cookie valable un jour
    res.status(200).json({ user, token });
  }
});

// @desc    Logout
// @route   GET /api/users/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // cookie(res, "", new Date()) // 👇 ici on a supprimer le token et on a fini la validité du cookie
  // la ligne de code en haut peut etre remplasser la code en dessous
  res.clearCookie("token"); // 👈
  return res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Logout
// @route   GET /api/users/logout
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const user = await User.findById(id);

  if (!user) {
    res.status(404)
    throw new Error(`There is no user with this id: ${id}`);
  }

  res.status(200).json({ user });
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
};
