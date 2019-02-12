/*
The feedback controller is used to control all functionality for displaying feedback page.
@author Amit Pandit apandit5@uncc.edu
*/
var Feedback = require("../models/Feedback.js");
var express = require('express');
var path = require('path');
var app = express();
var async = require("async");

module.exports = function(req, res, next) {

    if (req.method === 'GET') {

        if (req.session.theUser) {
            //if user already logged in
            res.render(path.resolve('./views/offerFeedBack'), {
                UserName: req.session.userName
            });

        } else {
            //if no user logged in  - ask for sign in
            res.render(path.resolve('./views/signIn'), {
                UserName: "",
                invalid: "",
                email: ""
            });
        }

    } else if (req.method === 'POST') {
        //user submitting the feedback information
        var feed = req.body;

        console.log(feed);
        
        var user = new Feedback({
            ratingGivenByUserId: req.session.theUser._id,
            userId: feed.userIdToBeRated,
            ratingToUser: feed.ratingToUser,
            comments: feed.comments,
            itemCode: feed.itemCode,
            ratingToItem: feed.ratingToItem,
        });


        user.save(function(err, doc) {
            if (err) {
                console.log(err);
            }
            res.send("Thank you for submitting your feedback" + doc);
        });

    } // GET if closed


};