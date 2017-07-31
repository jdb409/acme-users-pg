var express = require('express');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var path = require('path');
var db = require('./db');

var app = express();
var port = process.env.PORT || 3000;

app.use(require('method-override')('_method'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));

app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', { noCache: true });

app.use(function (req, res, next) {
    db.getUsers(function (users) {
        res.locals.uCount = users.length;
    });
    db.getManagers(function (managers) {
        res.locals.mCount = managers.length;
    });
    next();
});

app.get('/', function (req, res, next) {
    db.getUsers(function () {
        db.getManagers(function () {
            res.render('index', { uCount: res.locals.uCount, mCount: res.locals.mCount });
        });
    });
});

app.use('/users', require('./routes/users'));

app.use(function (err, req, res, next) {
    res.render('error', {err: err});
})

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
    db.sync(function (err) {
        if (err) console.log(err);
        db.seed(function (err) {
            if (err) console.log(err);
        });
    });
});

