var mongoose = require('mongoose');


var userProfileSchema = new mongoose.Schema({
    userId: String,
    userItems: String
});

module.exports = mongoose.model('userprofiles', userProfileSchema);