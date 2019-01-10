var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);


var usersSchema = new mongoose.Schema({
    _id: Number,
    firstName: String,
    lastName: String,
    email: String,
    addressField1: String,
    addressField2: String,
    city: String,
    state: String,
    postCode: String,
    country: String,
    password: String
}, {
    _id: false
});
usersSchema.plugin(AutoIncrement);

module.exports = mongoose.model('users', usersSchema);