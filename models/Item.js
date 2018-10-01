var fs = require('fs');
var catalog = fs.readFileSync("../models/catalog.json");

function Item(itemId, itemName, categoryCode, description, rating, imageUrl) {
    this.itemId = itemId;
    this.itemName = itemName;
    this.categoryCode = categoryCode;
    this.description = description;
    this.rating = rating;
    this.imageUrl = imageUrl;
}

function getItemList() {
    var jsonParsed;
    var jsonData = catalog;
    jsonParsed = JSON.parse(jsonData);
    return jsonParsed.items;
}

function getItem(itemId) {
    var jsonParsed;
    var jsonData = catalog;
    var categoryItemList;
    var item;
    jsonParsed = JSON.parse(jsonData);
    for (var i = 0; i < jsonParsed.items.length; i++) {
        if (String(jsonParsed.items[i].itemId) === itemId) {
            return jsonParsed.items[i];
        }
    }
    return false;
}

module.exports = Item;
module.exports.getItemList = getItemList;
module.exports.getItem = getItem;