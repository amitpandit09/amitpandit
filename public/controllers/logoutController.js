/*
The logout controller is used to control all functionality for handling logout page.
@author Amit Pandit apandit5@uncc.edu
*/
var path = require('path');
module.exports = function(req, res, next) {

    if (req.method === 'GET') {
        if (req.session.theUser) {
            res.render(path.resolve('./views/signIn'), {
                UserName: req.session.userName,
                invalid: "",
                email: ""
            });
            //destroy the session to invalid the user.
            req.session.destroy();
            next();

            next();
        } // GET if closed
        else {
            res.render(path.resolve('./views/signIn'), {
                UserName: req.session.userName,
                invalid: "",
                email: ""
            });
        }
    }
};