/*
The login controller is used to control all functionality for handling sign in page.
@author Amit Pandit apandit5@uncc.edu
*/
var UserProfile = require("../models/UserProfile.js");
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

        res.render(path.resolve('./views/signIn'), {
            UserName: req.session.userName,
            invalid: "",
            email: ""
        });
        next();

    } else if (req.method === 'POST') {
        var userItems;
        var listOfUserItems;

        async.series([function(callback) {

            User.findOne({
                email: req.body.email,
                password: req.body.password
            }, function(err, users) {
                if (err) return callback(err);
                req.session.theUser = JSON.parse(JSON.stringify(users));
                if (users == null) {
                    console.log(">> Invalid login attempt");
                    res.render(path.resolve('./views/signIn'), {
                        UserName: req.session.userName,
                        invalid: "Either username or password are incorrect. Please try again!",
                        email: ""
                    });
                } else {
                    callback(null, users);
                }
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
            //next();
        });

    } // GET if closed


};