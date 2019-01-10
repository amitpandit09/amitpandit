var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);

var categoriesSchema = new mongoose.Schema({
    categoryId: String,
    categoryName: String
}, {
    _id: false
});

module.exports = mongoose.model('categories', categoriesSchema);