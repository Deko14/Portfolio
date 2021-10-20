// Packages
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const helmet = require("helmet");
const cors = require("cors");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

// App
const app = express();
const port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log(`A NodeJS API is listetning on port: ${port}`)
);

// Docs
app.get("/", (req, res) => {
  fs.readFile("docs/apiDocs.json", (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

// Routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// Database
// When creating users, posts and everything else, MongoDB gives that document a unique ID
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"));

mongoose.connection.on("error", (err) => {
  console.log(`Database connection error: ${err.message}`);
});

// Middleware
app.use(morgan("dev")); // It shows the requests in the console when they are executed ex: GET / 304 13.867 ms - -
app.use(bodyParser.json()); // Express by it self doesnt parse the req.body, so thats why we use body-parser
app.use(cookieParser()); // This will help us parse the request cookie
app.use(expressValidator()); // Creates validation for data, error msgs ex: Tag must be more than 2 characters
app.use(helmet()); // Protect HTTP headers, extra security
app.use(cors()); // If u deploy the back-end and the front-end on different platforms/domains this helps share the resources
app.use("/", postRoutes); // Using const postRoutes = require("./routes/post"); as middleware
app.use("/", authRoutes); // Using const authRoutes = require("./routes/auth"); as middleware
app.use("/", userRoutes); // Using const userRoutes = require("./routes/user"); as middleware
app.use(function (err, req, res, next) {
  // If we encounter unauthorized error, send this(If user tries to access protected routes)
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized!" });
  }
});
