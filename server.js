// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var mongojs = require("mongojs");
var mongoose = require("mongoose");

// Initializing Express
var app = express();
app.use(express.static("public"));

// Setting up Handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Setting up Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Configuring database
var databaseURL = "goopscraper";
var collections = ["articles"];

var db = mongojs(databaseURL, collections);

db.on("error", function(err) {
    console.log("Database Error:", err);
});

// Setting up database to be deployed
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// ROUTES

// Scrapes website and saves data in MongoDB
app.get("/scrape", function(req, res) {
    request("https://goop.com", function(err, response, html) {
        var $ = cheerio.load(html);

        db.articles.remove({});

        $("a.nl-item").each(function(i, element) {
            var link = $(element).attr("href");
            var title = $(element).find("h3").text();
            var summary = $(element).find("p").text();
            var photoURL = $(element).find(".lazy-load-image-wrapper").find("img").attr("src");

            db.articles.insert({
                link: link,
                title: title,
                summary: summary,
                photoURL: photoURL
            });
        });

        res.redirect("/");
    });
});

// Retrieves all of the data from the articles collection in JSON
app.get("/", function(req, res) {
    db.articles.find({}, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.json(data);
        }
    });
});

// Setting the app up to listen
app.listen(3000, function() {
    console.log("App running on PORT 3000");
});