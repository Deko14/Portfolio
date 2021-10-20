const Post = require("../models/post");
const formidable = require("formidable"); //File handling for creating posts.
const fs = require("fs");
const _ = require("lodash");

//Init this method whenever there is :postId in the parametar
exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({
          error: err,
        });
      }
      req.post = post;
      next();
    });
};

// Using this method as an IDENTIFIER(middleware), when the user tries to create, remove, update his posts
exports.isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized!",
    });
  }
  next();
};

// GET all posts
exports.getPosts = (req, res) => {
  const posts = Post.find()
    .populate("postedBy", "_id name")
    .select("_id title tag description")
    .then((posts) => res.json({ posts })) // Dont have to send status code of 200 because thats is the default if everything goes correctly
    .catch((error) => console.log(error));
};

// GET all posts from a single user
exports.postsByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id name") // We use populate here because the data is on different model, ex here is in the User, so we cant use select to SELECT that data, we have to go with populate.
    .sort("_created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(posts);
    });
};

// CREATE a post
exports.createPost = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "File could not be uploaded!",
      });
    }
    let post = new Post(fields);

    post.hashed_password = undefined;
    post.salt = undefined;
    post.postedBy = req.profile;
    // console.log("PROFILE", req.profile);

    if (files.file) {
      post.file.data = fs.readFileSync(files.file.path);
      post.file.fileType = files.file.type;
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(result);
    });
  });
};

// UPDATE a post
exports.updatePost = (req, res, next) => {
  let post = req.post;
  post = _.extend(post, req.body);
  post.updated = Date.now();
  post.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(post);
  });
};

// DELETE a post
exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "Post deleted successfully.",
    });
  });
};
