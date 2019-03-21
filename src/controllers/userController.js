const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {

   signupForm(req, res, next) {
      res.render("users/signup");
   },


   signupUser(req, res, next) {
      let newUser = {
         username: req.body.username,
         email: req.body.email,
         password: req.body.password,
         passwordConfirmation: req.body.passwordConfirmation
      };

      userQueries.createUser(newUser, (err, user) => {
         if (err) {
            console.log(err);
            req.flash("error", err);
            res.redirect("/users/signup");
         } else {
            passport.authenticate("local")(req, res, () => {
               req.flash("notice", "You've been successfully logged in!");
               res.redirect("/");
            })
         }
      });
   },

   signinForm(req, res, next) {
      res.render("users/signin");
   },

   signinUser(req, res, next) {
      passport.authenticate("local")(req, res, () => {
         if (!req.user) {
            req.flash("notice", "Sign in failed. Please try again");
            res.redirect("/users/signup");
         } else {
            req.flash("notice", "You've successfully signed in!");
            res.redirect("/");
         }
      })
   },

   signoutUser(req, res, next) {
      req.logout();
      req.flash("notice", "You've successfully signed out!");
      res.redirect("/");
   },

   showProfile(req, res, next) {
      userQueries.getUser(req.params.id, (err, result) => {
         if (err || result.user == undefined) {
            req.flash("notice", "No user found with that Id");
            res.redirect("/");
         } else {
            res.render("users/show", result);
         }
      })
   },

   paymentScreen(req, res, next) {
      res.render("users/payment");
   },

   // update user to premium
   updatePremium(req, res, next) {
      var stripe = require("stripe")("sk_test_NY4J2HqXNTRjHh9rO6YUmVS800aqpvThCF");

      // Token is created using Checkout or Elements!
      // Get the payment token ID submitted by the form:
      const token = req.body.stripeToken; // Using Express

      const charge =  stripe.charges.create({
         amount: 999,
         currency: 'usd',
         description: 'Example charge',
         source: token
      });

      userQueries.updateUserRole(req.params.id, 1, (err, user) => {
         if (err || user == null) {
            req.flash("notice", "No user found matching that ID.");
            res.redirect(404, `/users/${req.params.id}`);
         } else {
            console.log("USER ROLE", user);
            req.flash("notice", "Welcome to Blocipedia Premium!");
            res.redirect(`/users/${req.params.id}`);
         }
      });

   },

   /// update user to standard
   updateStandard(req, res, next) {
      userQueries.updateUserRole(req.params.id, 0, (err, user) => {
         if (err || user == null) {
            req.flash("notice", "No user found matching that ID.");
            res.redirect(404, `/users/${req.params.id}`);
         } else {
            console.log("USER ROLE:", user);
            req.flash("notice", "Your account has been downgraded to a standard account.");
            res.redirect(`/users/${req.params.id}`);
         }
      });
   }

}
