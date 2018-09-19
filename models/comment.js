// Dependencies
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create comment schema
var CommentSchema = new Schema({
    comments: {
        type: String
    }
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;