const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const generateToken = require("../utils/generateToken");
const cookie = require("../utils/cookie");
const sendEmail = require("../utils/sendEmail");



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

// @desc    get user by id
// @route   GET /api/users/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error(`There is no user with this id: ${id}`);
  }
  res.status(200).json({ user });
});

// @desc    get user trough the cookie
// @route   GET /api/users
// @access  Private User
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { _id, name, email, photo, phone, bio, token } = user;
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
    throw new Error("User not found");
  }
});

// @desc    get loggin status
// @route   GET /api/users/loggedin
// @access  Private User
const logginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json(false);

  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) return res.json(true);

  res.json(false);
});

// @desc    update user without password
// @route   PATCH /api/users/updateuserMethodOne
// @access  Private User
// Method One 👀
const updateUserMethodOne = asyncHandler(async (req, res) => {
  try {
    const id = req.user._id;
    const { email: newEmail, ...updateData } = req.body; // newEmail = req.body.email

    // Check if the new email exists for another user (excluding the current user)
    const existingUser = await User.findOne({
      email: newEmail,
      _id: { $ne: id },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists for another user" });
    }

    // Update the email field in the updateData object
    updateData.email = newEmail;

    // Remove the password field from the updateData object
    delete updateData.password;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "An Error occurred", error });
  }
});

// @desc    update user without password
// @route   PATCH /api/users/updateuserMethodTwo
// @access  Private User
// Method Two 👀
const updateUserMethodTwoZ = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { name, email, photo, phone, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updateUser = await user.save();
    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      photo: updateUser.photo,
      phone: updateUser.phone,
      bio: updateUser.bio,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    updating password
// @route   PUT /api/users/changepasswordMethodOne
// @access  Private User
// Method One 👀
const changePasswordMethodOne = asyncHandler(async (req, res) => {
  // Trouvez l'utilisateur dans la base de données en utilisant l'ID vérifié du token
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("Utilisateur non trouvé");
  }

  // Vérifiez si l'ancien mot de passe correspond
  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Ancien mot de passe incorrect");
  }

  // Validate
  if (!oldPassword || !newPassword || !confirmNewPassword) {
    res.status(400);
    throw new Error("Please add old and newPassword and confirmNewPassword");
  }

  // Validez la correspondance du nouveau mot de passe et de la confirmation du mot de passe
  if (newPassword !== confirmNewPassword) {
    res.status(400);
    throw new Error(
      "Le nouveau mot de passe et la confirmation ne correspondent pas"
    );
  }

  // Mettez à jour le mot de passe de l'utilisateur
  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json({ message: "Mot de passe mis à jour avec succès" });
});

// @desc    updating password
// @route   PUT /api/users/changepasswordMethodTwo
// @access  Private User
// Method Two 👀
const changePasswordMethodTwoZ = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  if (!user) {
    res.status(404);
    throw new Error("User not found, please signup");
  }
  // Validate
  if (!oldPassword || !newPassword || !confirmNewPassword) {
    res.status(400);
    throw new Error("Please add old and newPassword and confirmNewPassword");
  }
  // check if old password matches password in DB
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  if (newPassword !== confirmNewPassword) {
    res.status(400);
    throw new Error("The newPassword and confirmNewPassword are not identical");
  }
  if (user && passwordIsCorrect) {
    user.password = newPassword;
    await user.save();
    res.status(200).send("password changed successfully");
  } else {
    res.status(404);
    throw new Error("Old password is incorrect");
  }
});

// @desc    send link for retrieve password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  // 5- verifier si un jeton de réinitialisation existe déjà pour cet utilisateur si oui on le supprime
  const token = await Token.findOne({userId: user._id})
  if(token) {
    await token.deleteOne()
  }

  // 1- Create Reset Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);// we use it for resetPassword , so we add it in params

   // 2- Hash token before saving to db
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 3- Save Token to DB
  await new Token({
    // Token come from tokenModel
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 60 * 1000, // + 30 min
  }).save();

  // Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // 4- Create Reset Email and Sent it
  const message = `<h2>Hello ${user.name}</h2>
  <p>PLease use the url below to reset your password</p>
  <p>This reset link is valid for only 30 minutes</p>
  <a href=${resetUrl} data-notrack="true">${resetUrl}</a>
  <p>Regards</p>
  <p>X Team</p>`;
  const subject = "Password Reset Request";
  const sent_to = user.email;
  const sent_from = `Dashboard ${process.env.EMAIL_USER}` // Dashboard is for label of email


  try {
    await sendEmail(subject, message, sent_to, sent_from);
    res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent");
  }
});

// @desc    Reset password
// @route   POST /api/users/resetpassword/:resetToken
// @access  Public
const resetPassword = asyncHandler(async(req, res) => {
  const {newPassword} = req.body;
  const {resetToken} = req.params

  // Hash token before saving to db
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // find token in DB
  const userToken = await Token.findOne({token: hashedToken, expiresAt: {$gt: Date.now()}})
  if(!userToken) {
    res.status(404)
    throw new Error("Invalid or Expired Token")
  }

  // find user
  const user = await User.findOne({_id: userToken.userId})
  user.password = newPassword
  await user.save()
  res.status(200).json({message: "Password Reset Successfully, Please Login"})

})

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUserById,
  getUser,
  logginStatus,
  updateUserMethodOne,
  updateUserMethodTwoZ,
  changePasswordMethodOne,
  changePasswordMethodTwoZ,
  forgotPassword,
  resetPassword
};
