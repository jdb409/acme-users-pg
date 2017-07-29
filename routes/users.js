var router = require('express').Router();
var db = require('../db');

router.get('/', function (req, res, next) {

    db.getUsers(function (users) {

        res.render('users', { users: users, uCount: res.locals.uCount, mCount: res.locals.mCount });
    });
});

router.post('/', function (req, res, next) {
    db.createUser({ name: req.body.user, manager: req.body.manager });
    if (req.body.manager) {
        res.redirect('/users/managers');
    } else {
        res.redirect('/users')
    }
});

router.delete('/:id', function (req, res, next) {
    db.deleteUser(req.params.id * 1, function () {
        res.redirect('/users');
    });
});

router.get('/managers', function (req, res, next) {
    db.getManagers(function (managers) {
        res.render('managers', { managers: managers, uCount: res.locals.uCount, mCount: res.locals.mCount });
    });
});

router.put('/:id', function (req, res, next) {
    db.updateInfo(req.params.id * 1, function (err, status) {
        if (err) console.log(err);
        console.log(status);
        if (status) {
            res.redirect('/users/managers');
        } else {
            res.redirect('/users');
        }

    });
});

router.get(function(err, req, res, next){
    res.render('error', {err: err});
})

module.exports = router;
