var fs = require('fs');
var catalog = fs.readFileSync("../models/catalog.json");

function Categories(categoryId, categoryName) {
    this.categoryId = categoryId;
    this.categoryName = categoryName;
}

function categoryPresentInCatalog(catalogCategory) {
    var jsonParsed;
    var jsonData = catalog;
    var categoryItemList;
    jsonParsed = JSON.parse(jsonData);
    for (var i = 0; i < jsonParsed.categories.length; i++) {
        if (String(jsonParsed.categories[i].categoryId) === catalogCategory) {
            return jsonParsed.categories[i].categoryName;
        }
    }
    return "InvalidCategory";
}

function getCategories() {
    var jsonParsed;
    var jsonData = catalog;
    jsonParsed = JSON.parse(jsonData);
    return jsonParsed.categories;
}

function getCategoryNameForItem(itemId) {
    var jsonParsed;
    var jsonData = catalog;
    var categoryItemList;
    var itemCategoryId;
    jsonParsed = JSON.parse(jsonData);
    for (var i = 0; i < jsonParsed.items.length; i++) {
        if (String(jsonParsed.items[i].itemId) === itemId) {
            itemCategoryId = jsonParsed.items[i].categoryId;
            if (itemCategoryId != "") {
                for (var i = 0; i < jsonParsed.categories.length; i++) {
                    if (String(jsonParsed.categories[i].categoryId) === itemCategoryId) {
                        return jsonParsed.categories[i];
                    }
                }
            }
        }
    }
    return false;
}

module.exports = Categories;
module.exports.getCategories = getCategories;
module.exports.categoryPresentInCatalog = categoryPresentInCatalog;
module.exports.getCategoryNameForItem = getCategoryNameForItem;