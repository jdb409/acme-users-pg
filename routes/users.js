var router = require('express').Router();
var db = require('../db');

router.get('/', function (req, res, next) {
    db.getUsers()
        .then(function(users){
            res.render('users', { users: users.rows, uCount: res.locals.uCount, mCount: res.locals.mCount });
        }).catch(function(err){
            return next(err);
        }); 
});

router.post('/', function (req, res, next) {
    db.createUser({ name: req.body.user, manager: req.body.manager })
        .then(function(result){
        if (req.body.manager) {
            res.redirect('/users/managers');
        } else {
            res.redirect('/users')
        }
        }).catch(function(err){
            return next(err);
        });
    
});

router.delete('/:id', function (req, res, next) {
     db.deleteUser(req.params.id * 1)
        .then(function(){
            res.redirect('/users');
        }).catch(function(err){
            console.log(err);
        });
});

router.get('/managers', function (req, res, next) {
    db.getManagers()
        .then(function(managers){
            res.render('managers', { managers: managers, uCount: res.locals.uCount, mCount: res.locals.mCount });
        }).catch(function(err){
            console.log(err);
        });
});

router.put('/:id', function (req, res, next) {

    db.updateInfo(req.params.id * 1)
        .then(function(status){
            console.log(status);
        if (status) {
            res.redirect('/users/managers');
        } else {
            res.redirect('/users');
        }
        // console.log(status);
        }).catch(function(err){
            console.log(err);
        });

    // db.updateInfo(req.params.id * 1, function (err, status) {
    //     if (err) return next(err);
    //     if (status) {
    //         res.redirect('/users/managers');
    //     } else {
    //         res.redirect('/users');
    //     }
    // });

});

module.exports = router;
