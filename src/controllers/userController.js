const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const Wiki = require("../db/models").Wiki;
const User = require("../db/models").User;
const passport = require("passport");

module.exports = {

   signupForm(req, res, next) {
      res.render("users/signup");
   },

   showAll(req, res, next){
       console.log("Made it to show all");
       userQueries.getAllUsers((err, users) => {
         if(err){
             res.redirect(500, "static/index");
         }
         else{
             console.log(users);
             res.render("wikis/edit", {users});
         }
       })
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
   // updateStandard(req, res, next) {
   //    userQueries.updateUserRole(req.params.id, 0, (err, user) => {
   //       if (err || user == null) {
   //          req.flash("notice", "No user found matching that ID.");
   //          res.redirect(404, `/users/${req.params.id}`);
   //       } else {
   //          wikiQueries.downgradePrivate(req.params.id, (err, wiki) => {
   //             console.log("USER ROLE:", user);
   //             req.flash("notice", "Your account has been downgraded to a standard account.");
   //             res.redirect(`/users/${req.params.id}`);
   //          });
   //       }
   //    });
   // }
   updateStandard(req, res, next) {
      User.findById(req.params.id)
      .then((user) => {
         user.role = 0;
         user.save();
         Wiki.update({ private: false}, { where: {userId: req.params.id} })
         .then((wiki) => {
            req.flash("notice", "You are now a standard user.");
            res.redirect(`/users/${req.params.id}`);
         })
      })
   }

}

// downgradePrivate(id, callback) {
//    return Wiki.all()
//    .then((wikis) => {
//       wikis.forEach((wiki) => {
//          if (id == wiki.userId && wiki.private == true) {
//             console.log(wiki);
//             wiki.update({private : false }, {fields: ["private"]})
//             .then(() => {
//                callback(null, wiki)
//             })
//          }
//       })
//    })
