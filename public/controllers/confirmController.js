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

        } //user if closed
        else {
            res.render(path.resolve('./views/signIn'), {
                UserName: "",
                invalid: "",
                email: ""
            });
        }
    } // GET if closed
    else if (req.method === 'POST') {
        if (req.session.theUser) {

           // console.log("AMIT"+req.body.confirmItem);


            async.series([function(callback) {
                UserItem.find({
                    item: req.body.confirmItem
                }, function(err, userItems) {
                    //console.log("AMIT"+userItems);
                    var userName = JSON.parse(JSON.stringify(userItems));
                })
            }, function(callback) {
                User.find({
                    _id: req.session.userIDTobeRated
                }, function(err, users) {
                    if (err) return callback(err);
                    var userName = JSON.parse(JSON.stringify(users));
                    callback(null, users);
                })
            }], function(err) {

            });

            res.render(path.resolve('./views/offerFeedBack'), {
                UserName: req.session.theUser.firstName,

            });
        } //user if closed
        else {
            res.render(path.resolve('./views/signIn'), {
                UserName: "",
                invalid: "",
                email: ""
            });
        }
    }
};