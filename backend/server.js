const express = require("express");
require("dotenv").config({ path: "config.env" });
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT;

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database Connected ${connect.connection.host}`); // à la place de connect en peut utiliser mongoose
  } catch (err) {
    console.log(`Database Error ${err}`);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (err) {
    console.log(`error ${err}`);
  }
};
startServer();

app.get("/", (req, res) => {
  res.send(`hello word ${process.env.TEXT}` );
});


