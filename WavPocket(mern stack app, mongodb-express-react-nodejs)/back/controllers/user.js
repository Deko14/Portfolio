const _ = require("lodash");
const User = require("../models/user");
const formidable = require("formidable"); // File handling for uploading files(Profile Photo)
const fs = require("fs");

// Init this method whenever there is :userId in the parametar
exports.userById = (req, res, next, id) => {
  User.findById(id)
    // Populate followers and following users array
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found!",
        });
      }
      req.profile = user; // Adds profile object in the request with the users information
      next();
    });
};

// Using this method as an IDENTIFIER(middleware), when the user tries to create, remove, update his profile
exports.hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id === req.auth._id; // Checks if the ids match with the incoming request
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized to perform this action.",
    });
  }
};

// GET all users
exports.getAllUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(users);
  }).select("name email updated created");
};

// GET single user
exports.getUser = (req, res) => {
  // Setting these 2 on undefined so that they dont get returned in the response
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

// UPDATE users
exports.updateUser = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded.",
      });
    }
    // Get user and modify
    let user = req.profile;
    user = _.extend(user, fields);
    user.updated = Date.now();
    // Handle the photo file
    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }
    // Save user
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          err: err,
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
  });
};

exports.userPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
};

// DELETE user
exports.deleteUser = (req, res, next) => {
  let user = req.profile;
  user.remove((err, user) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({ message: "User deleted successfully!" });
  });
};

// Add FOLLWOING
exports.addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $push: { following: req.body.followId } },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      next();
    }
  );
};

// Add FOLLOWER
exports.addFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: req.body.userId } },
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};


// Remove FOLLOWING
exports.removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $pull: { following: req.body.unfollowId } },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      next();
    }
  );
};

// Remove FOLLOWER
exports.removeFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    { $pull: { followers: req.body.userId } },
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};