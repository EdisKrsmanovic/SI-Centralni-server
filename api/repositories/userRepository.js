const bcrypt = require("bcrypt");
const pg = require('pg');
const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
}
);

exports.getUser = function (email, cb) {
    const user = pool.query('SELECT * FROM \"User\" WHERE \"email\"=$1::text', [email]).then(dbResponse => {
        console.log('User successfully retrievede.');
        cb(dbResponse.rows[0]);
      }, err1 => {
        console.log("Error " + err1.message);
        cb(null);
    });
    return user[0];
}

exports.addUser = function (user, cb) {
    hashedPass = bcrypt.hashSync(user.password, 12, function (err1, hashedPassword) {
        if(err1){
            console.log("error1");
            return "NOT OK";
        }
    });
    pool.query("INSERT INTO \"User\"(\"email\",\"password\",\"uloga\") VALUES ($1::text,$2::text,$3::text)",[user.email, hashedPass, user.uloga]).then(dbResponse=> {
        console.log('User successfully added.');
        cb("OK")
      }, err1 => {
        console.log(err1);
        cb("Error")
    });
    return "OK";
}

exports.removeUser = function (email, cb) {
    pool.query('DELETE FROM \"User\" WHERE \"email\"=$1::text',[email]).then(dbResponse=> {
        console.log('User successfully deleted.');
        cb("OK")
      }, err1 => {
        console.log("Error " + err1.message);
        cb("Error")
    });;
    return "OK";
}

exports.updateUser = function (info, cb) {
    pool.query("UPDATE \"User\" SET \"uloga\"=$1::text WHERE \"email\"=$2::text", [info.uloga, info.email]).then(dbResponse=> {
        console.log('User successfully updated.');
        cb("OK");
      }, err1 => {
        console.log("Error " + err1.message);
        cb("Error");
    });
    return "OK";
}

exports.updateUserRoleById = function (info, cb) {
    pool.query("UPDATE \"User\" SET \"uloga\"=$1::text WHERE \"id\"=$2", [info.uloga, info.id]).then(dbResponse=> {
        console.log('User successfully updated.');
        cb("OK");
      }, err1 => {
        console.log("Error " + err1.message);
        cb("Error");
    });
    return "OK";
}

exports.getUsers = function (cb) {
    return pool.query('SELECT \"id\", \"email\", \"uloga\" FROM \"User\"').then(dbResponse=> {
        console.log('Users successfully retrieved.');
        cb(200, dbResponse.rows);
    }, err1 => {
        console.log("Error " + err1.message);
        cb(500, {message: "Users are not authorized to perform action."});
    });
}

exports.getUserById = function (id, cb) {
    const user = pool.query('SELECT \"id\", \"email\", \"uloga\" FROM \"User\" WHERE \"id\"=$1', [id]).then(dbResponse => {
        console.log('User successfully retrieved.');
        cb(dbResponse.rows[0]);
      }, err1 => {
        console.log("Error " + err1.message);
        cb(null);
    });
    return user[0];
}

exports.updateUserInfo = function (info, cb) {
    hashedPass = bcrypt.hashSync(info.password, 12, function (err1, hashedPassword) {
        if(err1){
            console.log("error1");
            return "NOT OK";
        }
    });
    pool.query("UPDATE \"User\" SET \"email\"=$1::text,\"password\"=$2::text WHERE \"id\"=$3", [info.email, hashedPass, info.id]).then(dbResponse=> {
        console.log('User successfully updated.');
        cb("OK");
      }, err1 => {
        console.log("Error " + err1.message);
        cb("Error");
    });
    return "OK";
}

exports.updateUserEmail = function (info, cb) {
    pool.query("UPDATE \"User\" SET \"email\"=$1::text WHERE \"id\"=$2", [info.email, info.id]).then(dbResponse=> {
        console.log('User successfully updated.');
        cb("OK");
      }, err1 => {
        console.log("Error " + err1.message);
        cb("Error");
    });
    return "OK";
}

exports.updateUserPassword = function (info, cb) {
    hashedPass = bcrypt.hashSync(info.password, 12, function (err1, hashedPassword) {
        if(err1){
            console.log("error1");
            return "NOT OK";
        }
    });
    pool.query("UPDATE \"User\" SET \"password\"=$1::text WHERE \"id\"=$2", [hashedPass, info.id]).then(dbResponse=> {
        console.log('User successfully updated.');
        cb("OK");
      }, err1 => {
        console.log("Error " + err1.message);
        cb("Error");
    });
    return "OK";
}