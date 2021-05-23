const sqlite = require('sqlite-sync');
const bcrypt = require("bcrypt");
sqlite.connect('baza.db');
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

exports.getUser = function (email) {
    const user = sqlite.run('SELECT * FROM User WHERE Email=$1::text', [email]).then(dbResponse=> {
        console.log('User successfully retrievede.');
      }, err1 => {
        console.log("Error " + err1.message);
    });;
    return user[0];
}

exports.addUser = function (user) {
    hashedPass = bcrypt.hashSync(user.Password, 12, function (err1, hashedPassword) {
        if(err1){
            console.log("error1");
            return "NOT OK";
        }
    });
    pool.query("INSERT INTO \"User\"(\"email\",\"password\",\"uloga\") VALUES ($1::text,$2::text,$3::text)",[user.Email, hashedPass, user.Uloga]).then(dbResponse=> {
        console.log('User successfully added.');
      }, err1 => {
        console.log("Error " + err1.message);
    });
    return "OK";
}

exports.removeUser = function (email) {
    pool.query('DELETE FROM \"User\" WHERE \"email\"=$1::text',[email]).then(dbResponse=> {
        console.log('User successfully deleted.');
      }, err1 => {
        console.log("Error " + err1.message);
    });;
    return "OK";
}

exports.updateUser = function (info) {
    pool.query("UPDATE \"User\" SET \"uloga\"=$1::text WHERE \"email\"=$2::text", [info.Uloga, info.Email]).then(dbResponse=> {
        console.log('User successfully updated.');
      }, err1 => {
        console.log("Error " + err1.message);
    });;
    return "OK";
}

exports.getUsers = function () {
    return pool.query('SELECT \"email\", \"uloga\" FROM \"User\"').then(dbResponse=> {
        console.log('Users successfully retrieved.');
        console.log(dbResponse);
      }, err1 => {
        console.log("Error " + err1.message);
    });
}
