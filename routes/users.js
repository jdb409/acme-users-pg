var router = require('express').Router();
var db = require('../db');

router.get('/', function (req, res, next) {
    db.getUsers(function (users) {
        res.render('users', { users: users, uCount: res.locals.uCount, mCount: res.locals.mCount });
    });
});

router.post('/', function (req, res, next) {
    db.createUser({ name: req.body.user, manager: req.body.manager }, function (err) {
        if (err) return next(err);

        if (req.body.manager) {
            res.redirect('/users/managers');
        } else {
            res.redirect('/users')
        }
    });
});

router.delete('/:id', function (req, res, next) {
    db.deleteUser(req.params.id * 1, function (err) {
        if (err) return next(err);
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
        if (err) return next(err);
        if (status) {
            res.redirect('/users/managers');
        } else {
            res.redirect('/users');
        }
    });

});

module.exports = router;
