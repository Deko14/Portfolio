const jwt = require("jsonwebtoken"); // Used to generate a token for signin
const expressJwt = require("express-jwt"); // Help us project routes, when a protected route is accessed we use ExpressJWT
const User = require("../models/user");
require("dotenv").config();

// SIGN UP a user
exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    res.status(403).json({ error: "Email is taken." });
  }
  const user = await new User(req.body);
  await user.save();
  res.status(200).json({ message: "Sign up success! Please log in." });
};

// SIGN IN a user
exports.signin = (req, res) => {
  // Find the user based on the email
  const { email, password } = req.body;
  User.findOne({ email }, (error, user) => {
    // If error or no user
    if (error || !user) {
      return res
        .status(401)
        .json({ error: "User with that email does not exist." });
    }
    // If user is found, make sure the email and password match
    // Create authenticate method in the User model and use it here
    if (!user.authenticate(password)) {
      return res
        .status(401)
        .json({ error: "Email and password do not match." });
    }
    // Generate a token with user id and secret(from .env)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // Persist the token as 't' in the cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // Return response with user and token to the frontend client
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, email, name } });
  });
};

// SIGN OUT a user
exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.json({ message: "Signout success!" });
};

// Protecting routes
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth", //If the token is valid, express jwt appends the verified users id, in an auth key to the request object, so that we know the user is authenticated
});
