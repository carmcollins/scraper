// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var Article = require("../models/article");
var router = express.Router();

// Displays index page
router.get("/", function(req, res) {
    Article.find({saved: false}, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                data: data
            });
        }
    });
});

// Displays saved page
router.get("/saved", function(req, res) {
    Article.find({saved: true}, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.render("saved", {
                data: data
            });
        }
    });
});

module.exports = router;