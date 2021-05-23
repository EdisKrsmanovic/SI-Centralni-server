const sqlite = require('sqlite-sync');
const bcrypt = require("bcrypt");
sqlite.connect('baza.db')
const bcrypt = require("bcrypt");

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
    sqlite.run('INSERT INTO User(ID,Email,Password,Uloga) VALUES (?,?,?,?)',[null,user.Email, hashedPass, user.Uloga], function(err) {
        console.log('User successfully added.');
      });;
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
