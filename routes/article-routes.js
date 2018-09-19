// Dependencies
var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var Article = require("../models/article");
var Comment = require("../models/comment");
var router = express.Router();

// Scrapes website and saves data in database
router.get("/scrape", function(req, res) {
    request("https://goop.com", function(err, response, html) {
        var $ = cheerio.load(html);

        $("a.nl-item").each(function(i, element) {
            var result = {};

            result.link = $(element).attr("href");
            result.title = $(element).find("h3").text();
            result.summary = $(element).find("p").text();
            result.photoURL = $(element).find("div").find("img").attr("data-src");

            var entry = new Article(result);

            entry.save(function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                }
            });
        });

        res.redirect("/");
    });
});

// Removes scraped articles from database
router.delete("/clear", function(req, res) {
    Article.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed all articles");
        }
    });
});

// Updates an article to "saved" in the database
router.post("/save/:id", function(req, res) {
    Article.findOneAndUpdate({_id: req.params.id}, {saved: true}, {new: true}, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
});

// Updates an article to "unsaved" in the database
router.post("/unsave/:id", function(req, res) {
    Article.findOneAndUpdate({_id: req.params.id}, {saved: false}, {new: true}, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
});

// Gets article comments by ObjectId
router.get("/articles/:id", function(req, res) {
    Article.findOne({_id: req.params.id})
        .populate("comments")
        .then(function(res) {
            res.json(res);
        }).catch(function(err) {
            res.json(err);
        });
});

// Creates a new comment
router.post("/add-comment/:id", function(req, res) {
    Comment.create(req.body)
        .then(function(data) {
            Article.findOneAndUpdate({_id: req.params.id}, {$push: {
                comments: data._id
            }}, {
                new: true
            }, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                }
            });
        })
        .then(function(res) {
            res.json(res);
        }).catch(function(err) {
            res.json(err);
        });
});

// Deletes a comment
router.delete("/delete-comment/:id", function(req, res) {
    Comment.findOneAndRemove({_id: req.params.id})
        .exec(function(err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
            }
        });
});

module.exports = router;