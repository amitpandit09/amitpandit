/*
The item controller is used to control all functionality for displaying individual item page.
@author Amit Pandit apandit5@uncc.edu
*/
var User = require("../models/User.js");
var UserItem = require("../models/UserItem.js");
var Categories = require("../models/Categories.js");
var Item = require("../models/Items.js");
var express = require('express');
var path = require('path');
var app = express();
var async = require("async");

module.exports = function(req, res, next) {

    if (req.method === 'GET') {

        var theItem = req.query.itemId;
        //taking item id from query parameter

        if (req.session.theUser) {

            async.series([function(callback) {
                Item.find({
                    itemId: theItem
                }, function(err, item) {
                    if (err) return callback(err);
                    req.session.item = JSON.parse(JSON.stringify(item))[0];
                    callback(null, item);
                })
            }, function(callback) {

                Categories.find({
                    categoryId: req.session.item.categoryId
                }, function(err, category) {
                    if (err) return callback(err);

                    req.session.categoryName = JSON.parse(JSON.stringify(category))[0].categoryName;
                    callback(null, category);
                })
            }], function(err) {
                valid = true;
                res.render(path.resolve('./views/Item'), {
                    item: req.session.item,
                    categoryNameItem: req.session.categoryName,
                    valid,
                    notAvailable: "",
                    UserName: req.session.theUser.firstName
                });
                //res.end();
                // next();
            });

        } else {
            var theItem = req.query.itemId;
            async.series([function(callback) {
                Item.find({
                    itemId: theItem
                }, function(err, item) {
                    if (err) return callback(err);
                    req.session.item = JSON.parse(JSON.stringify(item))[0];
                    callback(null, item);
                })
            }, function(callback) {

                Categories.find({
                    categoryId: req.session.item.categoryId
                }, function(err, category) {
                    if (err) return callback(err);

                    req.session.categoryName = JSON.parse(JSON.stringify(category))[0].categoryName;
                    callback(null, category);
                })
            }], function(err) {
                valid = true;
                res.render(path.resolve('./views/Item'), {
                    item: req.session.item,
                    categoryNameItem: req.session.categoryName,
                    valid,
                    notAvailable: "",
                    UserName: ""
                });
                //res.end();
                // next();
            });
        } // GET if closed

    }
};