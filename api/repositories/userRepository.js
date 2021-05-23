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
    const user = sqlite.run('SELECT * FROM User WHERE Email=?', [email]);
    return user[0];
}

exports.addUser = function (user) {
    hashedPass = bcrypt.hashSync(user.Password, 12, function (err1, hashedPassword) {
        if(err1){
            console.log("error1");
            return "NOT OK";
        }
    });
    pool.query("INSERT INTO \"User\"(\"ID\",\"Email\",\"Password\",\"Uloga\") VALUES ((SELECT MAX(\"UserId\") + 1 FROM \"USER\"),$1::text,$2::text,$3::text)",[user.Email, hashedPass, user.Uloga]).then(dbResponse=> {
        console.log('User successfully added.');
      }, err1 => {
        console.log(err1.message);
    });
    return "OK";
}

exports.removeUser = function (email) {
    sqlite.run('DELETE FROM User WHERE Email=?',[email]);
    return "OK";
}

exports.updateUser = function (info) {
    sqlite.run("UPDATE User SET Uloga=? WHERE Email=?", [info.Uloga, info.Email]);
    return "OK";
}

exports.getUsers = function () {
    return sqlite.run('SELECT Email, Uloga FROM User');
}
