const router = require("express").Router();
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

router.get("/teste", async function (req, res) {
  res.send("<h1> olaaa </h1> ");
});

const cloudant = require("./cloudant/controller.js");
router.post("/api/v1/cloudant/getuser", cloudant.get_user);
router.post("/api/v1/cloudant/create", cloudant.create_user);
router.post("/api/v1/cloudant/validation_token", cloudant.validation_token);
router.get("/api/v1/cloudant/validation_code/:code", cloudant.validation_code);

module.exports = router;
