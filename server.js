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

// Configuring database
var databaseURL = "";
var collections = [""];

var db = mongojs(databaseURL, collections);

db.on("error", function(err) {
    console.log("Database Error:", err);
});

// Setting up database to be deployed
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);