const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const session = require('express-session');
// const db = require('../models')
const passport = require('../config/ppConfig');

// GET /bio
router.get("/edit", (req, res) => {
    return res.render("bio/edit");
})


module.exports = router;