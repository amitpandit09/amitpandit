/*
The profile controller is used to control all functionality for handling below actions on user profile
- accept action
- reject action
- withdraw action
@author Amit Pandit apandit5@uncc.edu
*/
var UserProfile = require("../models/UserProfile.js");
var User = require("../models/User.js");
var UserItem = require("../models/UserItem.js");
var Categories = require("../models/Categories.js");
var Item = require("../models/Items.js");
var express = require('express');
var path = require('path');
var async = require("async");
var app = express();

module.exports = function(req, res, next) {


    if (req.method === 'GET') {
        if (req.session.theUser) {
            console.log(">> session already exits with id =" + req.session.id);

            async.series([function(callback) {

                UserItem.find({
                    userId: req.session.theUser._id,
                    status: "pending"
                }, function(err, userItems) {
                    if (err) return callback(err);
                    req.session.userItems = userItems;
                    callback(null, userItems);
                })
            }, function(callback) {
                Item.find({}, function(err, items) {
                    if (err) return callback(err);
                    req.session.listOfPendingItems = UserItem.getPendingItemList(items, req.session.userItems);
                    callback(null, items);
                })
            }], function(err) {
                res.render(path.resolve('./views/mySwaps'), {
                    listOfPendingItems: req.session.listOfPendingItems,
                    userFiltered: false,
                    UserName: req.session.theUser.firstName
                });
            });
            //next();
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

            if (actionParameter.accept) {
                console.log(">> processing *accept action");
                async.series([function(callback) {

                    UserItem.findOneAndUpdate({
                        userId: req.session.theUser._id,
                        item: actionParameter.accept
                    }, {
                        $set: {
                            status: "swapped"
                        }
                    }, function(err, val) {
                        if (err) return callback(err);
                        callback(null, val);
                    })

                }, function(callback) {
                    User.findOne({
                        _id: req.session.theUser._id
                    }, function(err, users) {
                        if (err) return callback(err);
                        req.session.theUser = JSON.parse(JSON.stringify(users));;
                        callback(null, users);
                    })
                }, function(callback) {
                    UserProfile.findOne({
                        userId: req.session.theUser._id
                    }, function(err, userprofiles) {
                        if (err) return callback(err);
                        req.session.currentProfile = JSON.parse(JSON.stringify(userprofiles));;
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

            } else if (actionParameter.reject || actionParameter.withdraw) {
                var option;
                if (actionParameter.reject) {
                    option = actionParameter.reject;
                } else {
                    option = actionParameter.withdraw;
                }
                async.series([function(callback) {

                    UserItem.findOneAndUpdate({
                        userId: req.session.theUser._id,
                        item: option
                    }, {
                        $set: {
                            status: "N/A"
                        }
                    }, function(err, val) {
                        if (err) return callback(err);
                        callback(null, val);
                    })

                }, function(callback) {
                    User.findOne({
                        _id: req.session.theUser._id
                    }, function(err, users) {
                        if (err) return callback(err);
                        req.session.theUser = JSON.parse(JSON.stringify(users));;
                        callback(null, users);
                    })
                }, function(callback) {
                    UserProfile.findOne({
                        userId: req.session.theUser._id
                    }, function(err, userprofiles) {
                        if (err) return callback(err);
                        req.session.currentProfile = JSON.parse(JSON.stringify(userprofiles));;
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
        } else {
            res.render(path.resolve('./views/signIn'), {
                UserName: ""
            });
            next();
        }

    } else {
        res.render(path.resolve('./views/signIn'), {
            UserName: ""
        });
        next();
    }

};