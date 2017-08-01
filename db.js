var pg = require('pg');

var client = new pg.Client(process.env.DATABASE_URL);

client.connect(function (err) {
    if (err) console.log(err.message);
});

function query(sql, params) {
    return new Promise(function (resolve, reject) {
        client.query(sql, params, function (err, result) {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}

function sync() {
    var sql = `
        DROP TABLE IF EXISTS users;
        Create TABLE users(
            id SERIAL PRIMARY KEY,
            name CHARACTER VARYING(255) NOT NULL UNIQUE,
            manager BOOLEAN
            );
        `;

    return query(sql);
}

function seed() {
    return Promise.all([createUser({ name: 'Jon', manager: 'false' }), createUser({ name: 'Carolyn', manager: 'True' })]);
}

function createUser(user) {
    var sql = `
    INSERT INTO users
    (name, manager)
    VALUES ($1, $2)
`;
    var manager = user.manager || false;
    return query(sql, [user.name, manager]);

}

function getUsers() {
    var sql = `
        SELECT *
        FROM users
    `;

    return query(sql, null)
        .then(function (result) {
            return result;
        });
}

function getManagers() {
    var sql = `
        SELECT *
        FROM users
        WHERE manager = true;
    `;

    return query(sql, null)
        .then(function (result) {
            return result.rows;
        });
}

function deleteUser(id) {
    var sql = `
        DELETE FROM users
        WHERE id = $1;
    `;

    return query(sql, [id]);

}

function updateInfo(id) {
    var sql = `
        SELECT *
        FROM users
        WHERE id = $1;
        
    `;

    return query(sql, [id])
        .then(function (result) {
        sql = `
            UPDATE users
            SET manager = $1
            WHERE id = $2
            `;

            var managerStatus = !result.rows[0].manager;
            
            return query(sql, [id, managerStatus])
        }).then(function(result){
            console.log(result);
            return result;
        }).catch(function(err){
            console.log(err);
        });

    // client.query(sql, [id], function (err, result) {
    //     if (err) return cb(err);
    //     sql = `
    //     UPDATE users
    //     SET manager = $1
    //     WHERE id = $2
    //     `;

    //     var managerStatus = !result.rows[0].manager;

    //     client.query(sql, [managerStatus, id], function (err) {
    //         if (err) return cb(err);
    //         cb(null, managerStatus);
    //     });
    // })
}

module.exports = {
    sync, seed, getUsers, createUser, deleteUser, getManagers, updateInfo
}
