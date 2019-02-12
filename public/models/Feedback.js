var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);

var feedbackSchema = new mongoose.Schema({
    userId: Number,
    ratingGivenByUserId: Number,
    ratingToUser: Number,
    comments: String,
    itemCode: String,
    ratingToItem: Number,
});

module.exports = mongoose.model('feedback', feedbackSchema);