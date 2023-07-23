const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a email"],
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be up to 6 characters"],
      // j'ai mis ce code en commentaire en sait pas la longeur du password hasher
      // maxlength: [100, "Password must not be more than 23 characters"],
    },
    photo: {
      type: String,
      required: [true, "Please add a photo"],
      default:
        "https://www.lg.com/ca_en/images/cell-phones/md05804613/gallery/G6-large01_Black.jpg",
      // code non verifier
      // default: function () {
      //   return "/assets/avatar.png"; // Remplacez par le chemin d'accès relatif à votre image par défaut
      // },
    },
    phone: {
      type: String,
      default: "+212",
    },
    bio: {
      type: String,
      maxlength: [250, "Bio must not be more than 250 characters"],
      default: "bio",
    },
  },
  { timestamps: true }
);

// appliquer le hash avant (pre) toute operation d'enregistrement (save) de password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Hash password before saving to DB
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);

  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
