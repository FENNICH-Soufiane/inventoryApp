const asyncHandler = require("express-async-handler");

const User = require("../models/userModel")
const sendEmail = require("../utils/sendEmail")

const contactUs = asyncHandler(async (req, res) => {
  const { subject, content } = req.body;
  const user = await User.find(req.user._id)
  console.log(user[0].email);
  if(!user) {
    res.status(404)
    throw new Error("User not found, Please sign up")
  }
  if(!subject || !content) {
    res.status(400)
    throw new Error("Please fill in all field")
  }
  const sent_to = process.env.EMAIL_USER;
  const sent_from = `Dashboard ${process.env.EMAIL_USER}` // Dashboard is for label of email
  const reply_to = user[0].email
  const  message = `${content}<br/>${reply_to}`
  console.log(reply_to)
  try {
    await sendEmail(subject, message, sent_to, sent_from,reply_to);
    res.status(200).json({ success: true, message: "Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, Please try again");
  }

  res.status(200).send("ok");
});

module.exports = {
  contactUs,
};
