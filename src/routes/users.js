const express = require("express");
const router = express.Router();
const validation = require("./validation");

const userController = require("../controllers/userController");


// get signup form
router.get("/users/signup", userController.signup_form);
// "sign up" button - creates user if credentials valid
router.post("/users/signup", validation.validateUsers, userController.signup_user);
// router.post("/users", validation.validateUsers, userController.create);

// get sign in form
router.get("/users/signin", userController.signin_form);

// "sign in" button - signs user in if valid credentials
router.post("/users/signin", validation.validateUsers, userController.signin_user);

// signs user out
router.get("/users/signout", userController.signout_user);

// get user profile page with matching user id, including last 5 posts and comments.
// router.get("/users/:id", userController.show);

module.exports = router;
