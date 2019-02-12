/*
The signup controller is used to control all functionality for handling singn up page
@author Amit Pandit apandit5@uncc.edu
*/
var User = require("../models/User.js");
var express = require('express');
var path = require('path');
var app = express();


module.exports = function(req, res, next) {

    if (req.method === 'GET') {

        res.render(path.resolve('./views/signup'), {
            UserName: req.session.userName
        });
        next();
    } // GET if closed
    else if (req.method === 'POST') {
        var studentReq = req.body;

        User.findOneAndUpdate({
            email: studentReq.email
        }, {
            firstName: studentReq.firstName,
            lastName: studentReq.lastName,
            email: studentReq.email,
            addressField1: studentReq.addressField1,
            addressField2: studentReq.addressField2,
            city: studentReq.city,
            state: studentReq.state,
            postCode: studentReq.postCode,
            country: studentReq.country,
            password: studentReq.password
        }, {
            upsert: true
        }, function(err, doc) {
            if (err) {
                console.log(err);
            }
        });

        User.findOne({
            email: studentReq.email
        }, function(err, users) {

            if (err) {
                console.log(users);
            }
            res.send("user created with details" + users);
        });
    }

};