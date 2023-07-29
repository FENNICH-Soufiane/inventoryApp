const express = require("express");
const path = require("path");

require("dotenv").config({ path: "config.env" });
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Route
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute")
// error middleware
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// Middlewares
// express.json() => analyse les demandes JSON entrantes et met les données analysées dans req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// dans la version recente de node en utilise app.use(express.json()) à la place de bodyparser.json()
// app.use(bodyParser.json())
// middleware pour conserver les cookies
app.use(cookieParser());

// Servir les fichiers statiques depuis le répertoire "public"
app.use(express.static(path.join(__dirname, "uploads")));

// Routes Middleware
// ces routes doivent etre en dessous des middleware express
app.use("/api/users", userRoute);
app.use("/api/products", productRoute)


// Routes
app.get("/", (req, res) => {
  res.send(`hello word ${process.env.TEXT}`);
});

// errorHandler Should be the last middleware
app.use(errorHandler);

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database Connected ${connect.connection.host}`); // à la place de connect en peut utiliser mongoose
  } catch (err) {
    console.log(`Database Error ${err}`);
    process.exit(1);
  }
};

const port = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (err) {
    console.log(`error ${err}`);
  }
};
startServer();
