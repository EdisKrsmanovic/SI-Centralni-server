const sqlite = require('sqlite-sync');
const bcrypt = require("bcrypt");
const fs = require('fs')

fs.unlink('baza.db', (err) => {
    if (!err) {
        regenerisiBazu();
    }
});

function hashirajPassword(password) {
    return bcrypt.hashSync(password, 12);
}

async function regenerisiBazu() {
    sqlite.connect('baza.db')
    sqlite.run('CREATE TABLE User(ID INTEGER PRIMARY KEY AUTOINCREMENT, Email text NOT NULL, Password text NOT NULL, Uloga text NOT NULL)', (res) => {
        if (res.error) {
            console.log(res.error);
        } else {
            sqlite.run('INSERT INTO User(Email, Password, Uloga) VALUES(\'ekrsmanovi1@etf.unsa.ba\', \'' + hashirajPassword('password') + '\', \'Admin\')')
        }
    });

    sqlite.run('CREATE TABLE FADefinition(ID INTEGER PRIMARY KEY AUTOINCREMENT, Naziv text NOT NULL, GeoTag text NOT NULL, Tag text NOT NULL)');

//TODO: Dodati neke default podatke
}
