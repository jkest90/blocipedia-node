const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/wikis");
const markdown = require("markdown").markdown;

module.exports = {

    Editor(input, preview) {
      this.update = function() {
         preview.innerHTML = markdown.toHTML(input.value);
      };
      input.editor = this;
      this.update();
   },

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

   show_wiki(req, res, next) {
      wikiQueries.getWiki(req.params.id, (err, wiki) => {
         let wikiMarkdown = {
            title: markdown.toHTML(wiki.title),
            body: markdown.toHTML(wiki.body),
            private: wiki.private,
            userId: wiki.userId,
            id: wiki.id
         }
         if (err || wiki == null) {
            res.redirect(404, "/");
         } else {
            res.render("wikis/show", {wikiMarkdown});
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
      const authorized = new Authorizer(req.user).create();
      if (authorized) {
         let newWiki = {
            title: req.body.title,
            body:  req.body.body,
            private: req.body.private,
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
      } else {
         req.flash("notice", "You are not authorized to do that.");
      }
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

   },

   updateToPrivate(req, res, next) {
      wikiQueries.private(req, true, (err, wiki) => {
         if (err || wiki == null) {
            res.redirect(401, `/wikis`);
         } else {
            res.redirect(`/wikis/${wiki.id}`);
         }
      })
   },

   updateToPublic(req, res, next) {
      wikiQueries.private(req, false, (err, wiki) => {
         if (err || wiki == null) {
            res.redirect(401, `/wikis`);
         } else {
            res.redirect(`/wikis/${wiki.id}`);
         }
      })
   }



}
