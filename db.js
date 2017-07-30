var pg = require('pg');

var client = new pg.Client(process.env.DATABASE_URL);

client.connect(function (err) {
    if (err) console.log(err.message);
});

function sync(cb) {
    var sql = `
        DROP TABLE IF EXISTS users;
        Create TABLE users(
            id SERIAL PRIMARY KEY,
            name CHARACTER VARYING(255) NOT NULL UNIQUE,
            manager BOOLEAN
            );
        `;

    client.query(sql, function (err) {
        if (err) return cb(err);
        cb(null);
    });
}

function createUser(user, cb) {
    var sql = `
    INSERT INTO users
    (name, manager)
    VALUES ($1, $2)
`;
    var manager = user.manager || false;
    client.query(sql, [user.name, manager], function (err) {
        if (err) return cb(err);
        cb(err);
    });

}

function seed(cb) {
    createUser({ name: 'Jon', manager: 'false' }, function (err) {
        if (err) return cb(err);
        cb(null);
    });

    createUser({ name: 'Carolyn', manager: 'True' }, function (err) {
        if (err) return cb(err);
        cb(null);
    });
}

function getUsers(cb) {
    var sql = `
        SELECT *
        FROM users
    `;

    client.query(sql, function (err, result) {
        if (err) return cb(err);
        cb(result.rows);
    });
}

function deleteUser(id, cb) {
    var sql = `
        DELETE FROM users
        WHERE id = $1;
    `;

    client.query(sql, [id], function (err) {
        if (err) return cb(err);
        cb(null);
    })
}

function getManagers(cb) {
    var sql = `
        SELECT *
        FROM users
        WHERE manager = true;
    `;

    client.query(sql, function (err, result) {
        if (err) return cb(err);
        cb(result.rows);
    });
}

function updateInfo(id, cb) {
    var sql = `
        SELECT *
        FROM users
        WHERE id = $1;
    `
    client.query(sql, [id], function(err, result){
        if (err) return cb(err);
        sql = `
        UPDATE users
        SET manager = $1
        WHERE id = $2
        `;

        var managerStatus = !result.rows[0].manager;

        client.query(sql, [managerStatus, id], function (err) {
            if (err) return cb(err);
            console.log(managerStatus);
            cb(null, managerStatus);
        });
    })
}

module.exports = {
    sync, seed, getUsers, createUser, deleteUser, getManagers, updateInfo
}
