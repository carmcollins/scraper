// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Initializing Express
var port = process.env.PORT || 3000;
var app = express();

// Setting up Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static("public"));

// Routes
var htmlRouter = require("./routes/html-routes.js");
var articleRouter = require("./routes/article-routes.js");

app.use("/", htmlRouter);
app.use("/", articleRouter);

// Setting up Handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Setting up database to be deployed
var dbURI = "mongodb://127.0.0.1:27017/mongoHeadlines";

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect(dbURI);
}

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