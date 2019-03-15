const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/application");

module.exports = {

   show_all(req, res, next) {
      wikiQueries.getAllWikis((err, wikis) => {
         if (err) {
            console.log(err);
            res.redirect(500, "static/index");
         } else {
            res.render("wikis/wikis", { wikis });
         }
      });
   },

   newWiki_form(req, res, next) {
      const authorized = new Authorizer(req.user).new();
      // if (authorized) {
         res.render("wikis/new");
      // } else {
         // req.flash("notice", "You are not authorized to do that.");
         // res.redirect("wikis/wikis");
      // }
   },

   show_wiki(req, res, next) {
      wikiQueries.getWiki(req.params.id, (err, wiki) => {
         if (err || wiki == null) {
            res.redirect(404, "/");
         } else {
            res.render("wikis/show", { wiki });
         }
      });
   },

   edit_form(req, res, next) {
      wikiQueries.getWiki(req.params.id, (err, wiki) => {
         if (err || wiki == null) {
            res.redirect(404, "/");
         } else {
            res.render("wikis/edit", { wiki });
         }
      })
   },

   create_wiki(req, res, next) {
      let newWiki = {
         title: req.body.title,
         body: req.body.body,
         privacy: req.body.privacy,
         userId: req.user.id
      };

      wikiQueries.addWiki(newWiki, (err, wiki) => {
         if (err) {
            console.log(err);
            res.redirect(500, "/wikis");
         } else {
            console.log(wiki);
            res.redirect(303, `/wikis/${wiki.id}`);
         }
      })
   },

   destroy(req, res, next) {
      wikiQueries.deleteWiki(req, (err, wiki) => {
         if (err) {
            res.redirect(500, `/wikis`);
         } else {
            res.redirect(303, `/wikis`);
         }
      });
   },

   update(req, res, next) {
      wikiQueries.updateWiki(req, req.body, (err, wiki) => {
         if(err || wiki == null) {
            res.redirect(401, `/wikis`);
         } else {
            res.redirect(`/wikis/${wiki.id}`);
         }
      });

   }

}
