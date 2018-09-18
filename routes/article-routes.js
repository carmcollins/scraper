// Dependencies
var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var Article = require("../models/article");
var Comment = require("../models/comment");
var router = express.Router();

// Scrapes website and saves data in MongoDB
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

// Clears scraped articles
router.delete("/clear", function(req, res) {
    Article.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed all articles");
        }
    });
});

// Updates an article in the database once it's saved
router.post("/save/:id", function(req, res) {
    Article.findOneAndUpdate({_id: req.params.id}, {saved: true}, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
});

// Gets all the articles in the database
router.get("/articles", function(req, res) {
    Article.find({}, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.json(data);
        }
    });
});



// Gets all the saved articles in the database
router.get("/articles", function(req, res) {
    Article.find({saved: true}, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.json(data);
        }
    });
});

// Gets an article by it's ID
router.get("/articles/:id", function(req, res) {
    Article.find({
        _id: mongojs.ObjectId(req.params.id)
    }).populate("comments", function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.json(data);
        }
    });
});

// Create a new comment
router.post("/comment/:id", function(req, res) {
    var newComment = new Comment(req.body);

    newComment.save(function(err, newComment) {
        if (err) {
            console.log(err);
        } else {
            Article.update({
                _id: mongojs.ObjectId(req.params.id)
            }, {$push: {
                comments: newComment._id
            }}, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                    res.send(data);
                }
            });
        }
    });
});

// Unsave an article
router.post("/unsave/:id", function(req, res) {
    Article.update({
        _id: mongojs.ObjectId(req.params.id)
    }, {$set: {
        saved: false
    }}, function(err, unsaved) {
        if (err) {
            console.log(err);
        } else {
            res.json(unsaved);
        }
    });
});

module.exports = router;