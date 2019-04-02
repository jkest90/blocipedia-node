const collaboratorQueries = require("../db/queries.collaborators.js");

module.exports = {

   index(req, res, next) {
      collaboratorQueries.getAllCollaborators((err, users) => {
         if (err) {
            console.log(err);
            res.redirect(500, "static/index");
         } else {
            res.render("collaborators/index", { users });
         }
      })
   },

   create(req, res, next) {
      if (req.user) {
         collaboratorQueries.addCollaborator(req, (err, collaborator) => {
            if (err) {
               req.flash("error", err);
            }
            req.flash("notice", `User added as collaborator`);
            res.redirect(req.headers.referer);
         });
      } else {
         req.flash("notice", "must be a user to do that");
         res.redirect(req.headers.referer);
      }
   },

   destroy(req, res, next) {
      if (req.user) {
         collaboratorQueries.removeCollaborator(req, (err, collaborator) => {
            if (err) {
               req.flash("error", err);
            }
            req.flash("notice", `User removed as collaborator`);
            res.redirect(req.headers.referer);
         });
      } else {
         req.flash("notice", "must be a user to do that");
         res.redirect(req.headers.referer);
      }
   }


}
