const express = require("express");
const router = express.Router();

const collabController = require("../controllers/collabController");
const wikiController = require("../controllers/wikiController");

router.get("/wikis/:wikiId/collaborators", collabController.index);

router.post("/wikis/:wikiId/collaborators/create", collabController.create);

router.post("/wikis/:wikiId/collaborators/destroy", collabController.destroy);



module.exports = router;
