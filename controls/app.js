var Categories = require("../models/Categories.js");
var Item = require("../models/Item.js");

var express = require('express');
var path = require('path');

var app = express();

app.set('view engine', 'ejs');
app.use('/resources', express.static(path.join(__dirname, '../resources/')));

app.get('/index', function(req, res) {
    res.render(path.resolve('../views/index'));
});

app.get('/categories', function(req, res) {
    var noOfParameters = Object.keys(req.query).length;
    var queryParameterProvided = false;
    var categoryValid = false;
    var flag;;
    if (noOfParameters > 0) {
        if (Categories.categoryPresentInCatalog(req.query.catalogCategory) === "InvalidCategory") {
            console.info(">> Invalid catalogCategory has been provided in query parameters !");

            res.render(path.resolve('../views/categories'), {
                categories: Categories,
                itemList: Item,
                queryParameterProvided,
                categoryValid
            });
            res.end();
        } else {
            queryParameterProvided = true;
            categoryValid = true;
            var filteredCategory = new Categories(req.query.catalogCategory, Categories.categoryPresentInCatalog(req.query.catalogCategory));

            res.render(path.resolve('../views/categories'), {
                categories: Categories,
                itemList: Item,
                queryParameterProvided,
                categoryFilterd: filteredCategory,
                categoryValid
            });
            console.info(">> Valid catalogCategory found in query parameters !");
            res.end();
        }
    } else {
        res.render(path.resolve('../views/categories'), {
            categories: Categories,
            itemList: Item,
            queryParameterProvided
        });
    }
});

app.get('/about', function(req, res) {
    res.render(path.resolve('../views/about'));
});

app.get('/contact', function(req, res) {
    res.render(path.resolve('../views/contact'));
});

app.get('/Item', function(req, res) {

    var itemFromList = Item.getItem(req.query.itemId);
    var categoryNameForItem = Categories.getCategoryNameForItem(req.query.itemId);
    var item = new Item(itemFromList.itemId, itemFromList.itemName, itemFromList.categoryId, itemFromList.description, itemFromList.rating, itemFromList.imageUrl);

    if (!itemFromList) {
        res.render(path.resolve('../views/Item'));
    } else if (itemFromList) {
        res.render(path.resolve('../views/Item'), {
            item: item,
            categoryNameItem: categoryNameForItem
        });
    } else {
        res.render(path.resolve('../views/categories'), {
            catalog: Categories,
            itemList: Item
        });
    }
});

app.get('/mycart', function(req, res) {
    res.render(path.resolve('../views/mycart'));
});

app.get('/myorders', function(req, res) {
    res.render(path.resolve('../views/myorders'));
});

app.get('/mystore', function(req, res) {
    res.render(path.resolve('../views/mystore'));
});

app.get('/signin', function(req, res) {
    res.render(path.resolve('../views/signin'));
});

app.get('/store', function(req, res) {
    res.render(path.resolve('../views/store'));
});

app.get('/myItems', function(req, res) {
    res.render(path.resolve('../views/myItems'));
});
app.get('/swap', function(req, res) {
    var itemFromList = Item.getItem(req.query.itemId);
    var categoryNameForItem = Categories.getCategoryNameForItem(req.query.itemId);
    var item = new Item(itemFromList.itemId, itemFromList.itemName, itemFromList.categoryId, itemFromList.description, itemFromList.rating, itemFromList.imageUrl);

    if (!itemFromList) {
        res.render(path.resolve('../views/Item'));
    } else {
        res.render(path.resolve('../views/swap'), {
            item: item,
            categoryNameItem: categoryNameForItem
        });
    }
});
app.get('/mySwaps', function(req, res) {
    res.render(path.resolve('../views/mySwaps'));
});
app.listen(8080);