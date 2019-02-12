var Categories = require("./models/Categories.js");
var profileActions = require('./controllers/profileController')
var updateDeleteActionOnMyItems = require('./controllers/myItemActionsController');
var feedback = require('./controllers/feedbackController');
var catalogController = require('./controllers/catalogController');
var swapController = require('./controllers/swapController');
var loginController = require('./controllers/loginController');
var signupController = require('./controllers/signupController');
var logoutController = require('./controllers/logoutController');
var itemController = require('./controllers/itemController');
var Categories = require("./models/Categories.js");
var confirm = require('./controllers/confirmController');

const {
    check,
    validationResult
} = require('express-validator/check');
var session = require('express-session');
var express = require('express');
var path = require('path');
var app = express();

var mongoose = require('mongoose');

//setting up database connection
mongoose.connect('mongodb://localhost/itemswapping', {
    useNewUrlParser: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log(">> Connected to database successfully");
});

app.use(session({
    secret: "cookie_secret",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

var bodyParser = require('body-parser');
var bodyencodedUrls = bodyParser.urlencoded({
    extended: true
})

app.set('view engine', 'ejs');
app.use('/resources', express.static(path.join(__dirname, './resources/')));

app.get('/Item', itemController);

app.get('/', function(req, res) {
    res.render(path.resolve('./views/index'), {
        UserName: req.session.userName
    });
});


app.get('/about', function(req, res) {
    res.render(path.resolve('./views/about'), {
        UserName: req.session.userName
    });
});

app.get('/contact', function(req, res) {
    res.render(path.resolve('./views/contact'), {
        UserName: req.session.userName
    });
});


app.get('/mycart', function(req, res) {
    res.render(path.resolve('./views/mycart'), {
        UserName: req.session.userName
    });
});

app.get('/myorders', function(req, res) {
    res.render(path.resolve('./views/myorders'), {
        UserName: req.session.userName
    });
});

app.get('/mystore', function(req, res) {
    res.render(path.resolve('./views/mystore'), {
        UserName: req.session.userName
    });
});

app.get('/store', function(req, res) {
    res.render(path.resolve('./views/store'), {
        UserName: req.session.userName
    });
});

app.post('/swap*', bodyencodedUrls, swapController);
app.get('/swap', bodyencodedUrls, swapController);

app.get('/categories', catalogController);

app.post('/signIn', bodyencodedUrls, [
        check('email', 'invalid').exists().isEmail(),
        check('password', 'invalid').isLength({
            min: 6
        })
    ],
    function(req, res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            if (req.body.email === "" || req.body.password === "") {
                res.render(path.resolve('./views/signIn'), {
                    UserName: req.session.userName,
                    invalid: "Email/UserName or password field is empty",
                    email: ""
                });

            } else if (errors.mapped().email) {
                if (errors.mapped().email.msg == "invalid") {
                    res.render(path.resolve('./views/signIn'), {
                        UserName: req.session.userName,
                        invalid: "",
                        email: "Incorrect format of UserName/Email. Expected format is example@uncc.edu !"
                    });
                }
            } else if (errors.mapped().password) {
                if (errors.mapped().password.msg == "invalid") {
                    res.render(path.resolve('./views/signIn'), {
                        UserName: req.session.userName,
                        invalid: "",
                        email: "Incorrect format of passowrd. Expected format is min 6 characters !"
                    });
                }
            }

        } else {
            next();
        }
    }, loginController);


app.post('/signIn', bodyencodedUrls, loginController);

app.get('/signIn', bodyencodedUrls, loginController);

app.post('/signup*', bodyencodedUrls, signupController);
app.get('/signup', bodyencodedUrls, signupController);

app.get('/signOut', logoutController);

app.post('/myItems*', bodyencodedUrls, updateDeleteActionOnMyItems);
app.get('/myItems', updateDeleteActionOnMyItems);

app.post('/mySwaps*', bodyencodedUrls, profileActions);
app.get('/mySwaps', profileActions);

app.post('/confirm*', bodyencodedUrls, confirm);
app.get('/confirm', confirm);

app.post('/offerFeedBack*', bodyencodedUrls, feedback);
app.get('/offerFeedBack', feedback);

app.listen(8080);