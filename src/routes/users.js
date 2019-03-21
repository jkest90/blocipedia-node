const express = require("express");
const router = express.Router();
const validation = require("./validation");

const userController = require("../controllers/userController");


// get signup form
router.get("/users/signup", userController.signupForm);

// "sign up" button - creates user if credentials valid
router.post("/users/signup", validation.validateUsers, userController.signupUser);

// get sign in form
router.get("/users/signin", userController.signinForm);

// "sign in" button - signs user in if valid credentials
router.post("/users/signin", validation.validateUsers, userController.signinUser);

// signs user out
router.get("/users/signout", userController.signoutUser);

// show user profile
router.get("/users/:id", userController.showProfile);

// show payment upgrade screen
router.get("/users/:id/payment", userController.paymentScreen);


// submit premium upgrade
router.post("/users/:id/updateStandard", userController.updateStandard);

// submit premium downgrade
router.post("/users/:id/updatePremium", userController.updatePremium);


module.exports = router;
