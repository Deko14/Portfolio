const express = require("express");
const { userById } = require("../controllers/user");
const { signup, signin, signout } = require("../controllers/auth");
const { userSignupValidator } = require("../validators"); // No need to specify index, and only works for that name

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

router.param("userId", userById); // Any route containing :userId, ouer app will execute userById()

module.exports = router;
