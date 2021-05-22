const sqlite = require('sqlite-sync');
sqlite.connect('baza.db')
const bcrypt = require("bcrypt");

exports.getUser = function (email) {
    const user = sqlite.run('SELECT * FROM User WHERE Email=?', [email]);
    return user[0];
}


