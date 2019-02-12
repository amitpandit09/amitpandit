var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);

var itemsSchema = new mongoose.Schema({
    itemId: String,
    itemName: String,
    categoryId: String,
    description: String,
    rating: String,
    imageUrl: String
}, {
    _id: false
});

module.exports = mongoose.model('items', itemsSchema);

function getUserItemList(items, userId, userProfileItemList) {

    var jsonParsed;
    var jsonData = items;
    jsonParsed = JSON.parse(jsonData);
    var userProfileItemList = JSON.parse(userProfileItemList);
    var userItemList = {
        items: []
    };
    var flag = false;

    for (var i = 0; i < jsonParsed.length; i++) {
        flag = false;
        for (var j = 0; j < userProfileItemList.length; j++) {
            if (jsonParsed[i].itemId === userProfileItemList[j].item) {
                flag = true;
                break;
            } else {
                flag = false;
            }
        }
        if (!flag) {
            userItemList.items.push(jsonParsed[i]);
        }
    }
    return userItemList;
}

module.exports.getUserItemList = getUserItemList;