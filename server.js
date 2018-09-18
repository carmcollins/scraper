// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var Article = require("./models/article.js");
var Comment = require("./models/comment.js");

// Initializing Express
var port = process.env.PORT || 3000;
var app = express();
app.use(express.static("public"));

// Setting up Handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Setting up Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Routes
var htmlRouter = require("./routes/html-routes.js");
var articleRouter = require("./routes/article-routes.js");

app.use("/", htmlRouter);
app.use("/", articleRouter);

// Setting up database to be deployed
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var db = mongoose.connection;

db.on("error", function(err) {
    console.log("Mongoose Error: ", err);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});

// Setting the app up to listen
app.listen(port, function() {
    console.log("App running on PORT 3000");
});