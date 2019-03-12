const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {

   signup_form(req, res, next) {
      res.render("users/signup");
   },

   signup_user(req, res, next) {
      let newUser = {
         username: req.body.username,
         email: req.body.email,
         password: req.body.password,
         passwordConfirmation: req.body.passwordConfirmation
      };

      userQueries.createUser(newUser, (err, user) => {
         if(err) {
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
   }

}
