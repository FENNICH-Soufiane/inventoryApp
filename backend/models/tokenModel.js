const mongoose = require("mongoose");

const tokenShema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user", // on peut mettre soit user ou bien User
    },
    token: {
      type: String,
      required: true,
    },
    // je vais crée timestamps manuellement
    createdAt: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  }
  // { timestamps: true }
);

const Token = mongoose.model("Token", userSchema);
module.exports = Token;
