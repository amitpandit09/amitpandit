/*
The catalog controller is used to control all functionality for displaying categories page.s
@author Amit Pandit apandit5@uncc.edu
*/
var Categories = require("../models/Categories.js");
var UserItem = require("../models/UserItem.js");
var Item = require("../models/Items.js");
var express = require('express');
var path = require('path');
var app = express();
var async = require("async");

module.exports = function(req, res, next) {

    if (req.method === 'GET') {
        //if GET method
        if (req.session.theUser) {
            //if user is already logged in

            console.log(">>User already Logged in : " + req.session.theUser.firstName);
            var userItemList;

            //intiating a series of callback to retrieve all required data for rendering catalog page.

            async.series([function(callback) {
                //fetching categories 
                Categories.find({}, function(err, categories) {
                    if (err) return callback(err);
                    req.session.categories = JSON.parse(JSON.stringify(categories));
                    callback(null, categories);
                })
            }, function(callback) {
                //fetching items
                Item.find({}, function(err, items) {
                    if (err) return callback(err);
                    req.session.itemList = JSON.stringify(items);
                    callback(null, items);
                })
            }, function(callback) {
                //fetching useritems 
                UserItem.find({}, function(err, userItems) {
                    if (err) return callback(err);
                    req.session.userItemList = Item.getUserItemList(req.session.itemList, req.session.theUser.userId, JSON.stringify(userItems));
                    callback(null, userItems);

                })
                //render categories page for normal logged in user with above fetched information
            }], function(err) {
                res.render(path.resolve('./views/categories'), {
                    categories: req.session.categories,
                    itemList: req.session.itemList,
                    queryParameterProvided: false,
                    categoryName: "",
                    userFiltered: "true",
                    userID: req.session.theUser.userId,
                    userProfileItemList: req.session.userItemList,
                    UserName: req.session.theUser.firstName
                });
            });

        } else {
            // if POST

            var noOfParameters = Object.keys(req.query).length;
            // if the request is through query parameter

            if (noOfParameters > 0) {
                // atleast one parameter required
                var categories;
                //series of callback to fetch information required to render category page.

                async.series([function(callback) {

                    Categories.find({}, function(err, categories) {
                        if (err) return callback(err);
                        req.session.categories = JSON.parse(JSON.stringify(categories));
                        callback(null, categories);
                    })
                }, function(callback) {

                    Item.find({
                        categoryId: req.query.catalogCategory
                    }, function(err, items) {
                        if (err) return callback(err);
                        req.session.itemList = JSON.parse(JSON.stringify(items));
                        callback(null, items);
                    })
                }, function(callback) {

                    Categories.find({
                        categoryId: req.query.catalogCategory
                    }, function(err, categories) {
                        if (err) return callback(err);
                        req.session.categoryName = JSON.parse(JSON.stringify(categories))[0].categoryName;
                        callback(null, categories);
                    })
                }], function(err) {
                    res.render(path.resolve('./views/categories'), {
                        categories: req.session.categories,
                        itemList: req.session.itemList,
                        queryParameterProvided: true,
                        categoryName: req.session.categoryName,
                        categoryValid: true,
                        userFiltered: "false",
                        userProfileItemList: req.session.currentProfile,
                        UserName: ""
                    });
                });

            } //if to valid cat closed
            else {
                //if no query parameters provided.

                var categories;
                async.series([function(callback) {

                    Categories.find({}, function(err, categories) {
                        if (err) return callback(err);
                        req.session.categories = JSON.parse(JSON.stringify(categories));
                        callback(null, categories);
                    })
                }, function(callback) {

                    Item.find({}, function(err, items) {
                        if (err) return callback(err);
                        req.session.itemList = JSON.parse(JSON.stringify(items));
                        callback(null, items);
                    })
                }], function(err) {
                    res.render(path.resolve('./views/categories'), {
                        categories: req.session.categories,
                        itemList: req.session.itemList,
                        queryParameterProvided: false,
                        categoryName: "",
                        categoryValid: true,
                        userFiltered: "false",
                        userProfileItemList: req.session.currentProfile,
                        UserName: ""
                    });
                });

            }

        } // GET if closed

    }
}