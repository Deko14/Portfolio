const express = require("express");
const {
  userById,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  userPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower
} = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();

router.put("/user/follow", requireSignin, addFollowing, addFollower)
router.put("/user/unfollow", requireSignin, removeFollowing, removeFollower)

router.get("/users", getAllUsers);
router.get("/user/:userId", requireSignin, getUser);
router.put("/user/:userId", requireSignin, updateUser);
router.delete("/user/:userId", requireSignin, deleteUser);

// Photo
router.get("/user/photo/:userId", userPhoto)

router.param("userId", userById); // Any route containing :userId, ouer app will execute userById()

module.exports = router;
