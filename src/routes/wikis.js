const express = require("express");
const router = express.Router();
const validation = require("./validation");

const wikiController = require("../controllers/wikiController");

router.get("/wikis", wikiController.show_all);
router.get("/wikis/new", wikiController.newWiki_form);
router.get("/wikis/:id", wikiController.show_wiki);
router.get("/wikis/:id/edit", wikiController.edit_form);
router.post("/wikis/create", wikiController.create_wiki);
router.post("/wikis/:id/destroy", wikiController.destroy);
router.post("/wikis/:id/update", wikiController.update);

module.exports = router;

// // redirecs to /topics/:id on success
// router.post("/topics/:id/update", validation.validateTopics, topicController.update);
