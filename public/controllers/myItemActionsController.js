/*
The ItemActoin controller is used to control all functionality for handling below actions on myitems page.
- update action
- delete action
@author Amit Pandit apandit5@uncc.edu
*/
var Categories = require("../models/Categories.js");
var User = require("../models/User.js");
var UserItem = require("../models/UserItem.js");
var Item = require("../models/Items.js");
var express = require('express');
var path = require('path');
var app = express();
var async = require("async");

module.exports = function(req, res, next) {

    if (req.method === 'GET') {
        if (req.session.theUser) {

            console.log("User already Logged in : " + req.session.theUser.firstName);

            res.render(path.resolve('./views/myItems'), {
                userProfileCurrentItems: req.session.currentProfile,
                listOfUserItems: req.session.listOfUserItems,
                userDetails: req.session.theUser,
                itemNames: Item,
                categoryNameItem: Categories,
                userItemList: UserItem,
                UserName: req.session.userName
            });
            next();
        } else {

            res.render(path.resolve('./views/signIn'), {
                UserName: "",
                invalid: "",
                email: ""
            });
        }
    } else if (req.method === 'POST') {

        if (req.session.theUser) {

            var actionParameter = req.body;

            if (actionParameter.update) {
                var status;
                console.log(">> processing *update action");
                async.series([function(callback) {

                    UserItem.findOne({
                        userId: req.session.theUser._id,
                        item: actionParameter.update
                    }, function(err, userItem) {
                        if (err) return callback(err);
                        var userItem = JSON.parse(JSON.stringify(userItem));

                        req.session.userItem = userItem;
                        req.session.userItemStatus = userItem.status;
                        req.session.userItemId = userItem.item;
                        req.session.userSwapItem = userItem.swapItem;

                        callback(null, userItem);
                    })
                }, function(callback) {

                    Item.find({
                        itemId: req.session.userItemId
                    }, function(err, item) {
                        if (err) return callback(err);
                        req.session.userItemName = JSON.parse(JSON.stringify(item))[0].itemName;
                        callback(null, item);
                    })
                }, function(callback) {

                    Item.find({
                        itemId: req.session.userSwapItem
                    }, function(err, item) {
                        if (err) return callback(err);
                        req.session.userSwapItem = JSON.parse(JSON.stringify(item))[0].itemName;
                        callback(null, item);
                    })
                }, function(callback) {

                    Item.find({
                        itemId: actionParameter.update
                    }, function(err, item) {
                        if (err) return callback(err);
                        req.session.itemAvailable = JSON.parse(JSON.stringify(item))[0];
                        callback(null, item);
                    })
                }, function(callback) {

                    Categories.find({
                        categoryId: req.session.itemAvailable.categoryId
                    }, function(err, category) {
                        if (err) return callback(err);

                        req.session.categoryNameAvailable = JSON.parse(JSON.stringify(category))[0].categoryName;
                        callback(null, category);
                    })
                }], function(err) {

                    if (req.session.userItemStatus == "pending") {
                        res.render(path.resolve('./views/mySwaps'), {
                            userItem: req.session.userItemName,
                            userItemId: req.session.userItemId,
                            userDetails: req.session.theUser,
                            swapItem: req.session.userSwapItem,
                            userItemStatus: req.session.userItemStatus,
                            UserName: req.session.theUser.firstName,
                            listOfPendingItems: req.session.listOfUserItems,
                            userFiltered: true
                        });

                    } else if (req.session.userItemStatus === "available" || req.session.userItemStatus === "swapped") {
                        valid = true;
                        res.render(path.resolve('./views/Item'), {
                            item: req.session.itemAvailable,
                            categoryNameItem: req.session.categoryNameAvailable,
                            valid,
                            notAvailable: "",
                            UserName: req.session.theUser.firstName
                        });
                    }
                });

            } else if (actionParameter.delete) {
                console.log(">> processing *delete action");
                async.series([function(callback) {

                    UserProfile.update({
                        userId: req.session.theUser._id
                    }, {
                        $pull: {
                            userItems: actionParameter.delete
                        }
                    }, function(err, val) {
                        if (err) return callback(err);
                        callback(null, val);
                    })

                }, function(callback) {
                    UserItem.remove({
                        userId: req.session.theUser._id,
                        item: actionParameter.delete
                    }, function(err, val) {
                        if (err) return callback(err);
                        callback(null, val);
                    })
                }, function(callback) {
                    User.findOne({
                        _id: req.session.theUser._id
                    }, function(err, users) {
                        if (err) return callback(err);
                        req.session.theUser = JSON.parse(JSON.stringify(users));
                        callback(null, users);
                    })
                }, function(callback) {
                    UserProfile.findOne({
                        userId: req.session.theUser._id
                    }, function(err, userprofiles) {
                        if (err) return callback(err);
                        req.session.currentProfile = JSON.parse(JSON.stringify(userprofiles));
                        callback(null, userprofiles);
                    })
                }, function(callback) {
                    Item.find({}, function(err, items) {
                        if (err) return callback(err);
                        req.session.itemList = JSON.stringify(items);
                        callback(null, items);
                    })
                }, function(callback) {
                    Categories.find({}, function(err, categories) {
                        if (err) return callback(err);
                        req.session.categories = JSON.parse(JSON.stringify(categories));
                        callback(null, categories);
                    })
                }, function(callback) {
                    UserItem.find({
                        userId: req.session.theUser._id
                    }, function(err, useritems) {
                        if (err) return callback(err);
                        req.session.listOfUserItems = UserItem.getUserItemListFromProfile(req.session.categories, req.session.itemList, req.session.currentProfile, req.session.theUser, useritems);
                        callback(null, useritems);
                    })
                }], function(err) {
                    res.render(path.resolve('./views/myItems'), {
                        userProfileCurrentItems: req.session.currentProfile,
                        listOfUserItems: req.session.listOfUserItems,
                        userDetails: req.session.theUser,
                        itemNames: Item,
                        categoryNameItem: Categories,
                        userItemList: UserItem,
                        UserName: req.session.theUser.firstName
                    });
                    // next();
                });
            }
        } //post end
        else {
            //no action parameter
            res.render(path.resolve('./views/myItems'), {
                userProfileCurrentItems: req.session.currentProfile,
                listOfUserItems: req.session.listOfUserItems,
                userDetails: req.session.theUser,
                itemNames: Item,
                categoryNameItem: Categories,
                userItemList: UserItem,
                UserName: req.session.userName
            });
            // next();
        }
        //next();
    } else {
        res.render(path.resolve('./views/signIn'), {
            UserName: ""
        });
    }
};