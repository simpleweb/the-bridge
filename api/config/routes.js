const express = require("express");
const router = express.Router();
const posts = require("../app/controllers/posts");

router.get("/posts", posts.index);

module.exports = router;
