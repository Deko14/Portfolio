const express = require("express");
const { userById } = require("../controllers/user");
const { getPosts, createPost, postsByUser, postById, isPoster, deletePost, updatePost } = require("../controllers/post");
const { requireSignin } = require("../controllers/auth");
const { createPostValidator } = require("../validators"); // No need to specify index, and only works for that name

const router = express.Router();

router.get("/posts", getPosts);
router.post(
  "/post/new/:userId",
  requireSignin,
  createPost,
  createPostValidator
);
router.get("/posts/by/:userId", requireSignin, postsByUser);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);



router.param("userId", userById); // Any route containing :userId, ouer app will execute userById()
router.param("postId", postById); // Any route containing :postId, ouer app will execute postById()

module.exports = router;
