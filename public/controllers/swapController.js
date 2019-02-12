var User = require("../models/User.js");
var UserItem = require("../models/UserItem.js");
var Categories = require("../models/Categories.js");
var Item = require("../models/Items.js");
var express = require('express');
var async = require("async");
var path = require('path');
var app = express();


module.exports = function(req, res, next) {

    if (req.method === 'GET') {
 if (req.session.theUser) {

            console.log("User already Logged in : " + req.session.theUser.firstName);

        var itemFromList = Item.getItem(req.query.itemId);
        var categoryNameForItem = Categories.getCategoryNameForItem(req.query.itemId);
        var item = new Item(itemFromList.itemId, itemFromList.itemName, itemFromList.categoryId, itemFromList.description, itemFromList.rating, itemFromList.imageUrl);

        if (!itemFromList) {
            res.render(path.resolve('./views/Item'));
        } else {
            res.render(path.resolve('./views/swap'), {
                item: item,
                categoryNameItem: categoryNameForItem,
                UserName: req.session.userName
            });
        }
        next();
    }//user if closed
    else{
        res.render(path.resolve('./views/signIn'), {
                UserName: "",
                invalid: "",
                email: ""
            });
    }
    } // GET if closed
    else if (req.method === 'POST') {
 if (req.session.theUser) {       

        var itemId = req.body.swapit

        async.series([function(callback) {
            Item.find({
                itemId: itemId
            }, function(err, item) {
                if (err) return callback(err);
                req.session.item = JSON.parse(JSON.stringify(item))[0];
                callback(null, item);
            })
        }, function(callback) {
            Item.find({}, function(err, items) {
                if (err) return callback(err);
                req.session.itemList = items;
                callback(null, items);
            })
        }, function(callback) {

            Categories.find({
                categoryId: req.session.item.categoryId
            }, function(err, category) {
                if (err) return callback(err);

                req.session.categoryName = JSON.parse(JSON.stringify(category))[0].categoryName;

                callback(null, category);
            })
        }, function(callback) {
            UserItem.find({}, function(err, useritems) {
                if (err) return callback(err);
                //req.session.listOfUserItems = UserItem.getUserItemListFromProfile(req.session.categories,req.session.itemList,req.session.currentProfile,req.session.theUser,useritems);
                req.session.availableItems = UserItem.checkAvailableItem(useritems, req.session.itemList,req.session.theUser._id);
                
                callback(null, useritems);
            })
        }], function(err) {
            if (req.session.availableItems.items.length == "") {
                valid = true;
                res.render(path.resolve('./views/Item'), {
                    item: req.session.item,
                    categoryNameItem: req.session.categoryName,
                    valid,
                    notAvailable: "",
                    UserName: req.session.theUser.firstName
                });
            } else {
                res.render(path.resolve('./views/swap'), {
                    item: req.session.item,
                    categoryNameItem: req.session.categoryName,
                    availableItems: req.session.availableItems,
                    availableItemsForUser: true,
                    itemNames: Item,
                    UserName: req.session.userName
                });

            }
        });
             }//user if closed
    else{
        res.render(path.resolve('./views/signIn'), {
                UserName: "",
                invalid: "",
                email: ""
            });
    }
    }
};