const sqlite = require('sqlite-sync');
const bcrypt = require("bcrypt");
sqlite.connect('baza.db')


exports.addFaDefintion = function (faDefintion) {
    const {Naziv, GeoTag, Tag} = faDefintion;

    sqlite.run('INSERT INTO FADefinition(Naziv, GeoTag, Tag) VALUES (?,?,?)',[Naziv, GeoTag, Tag], function(res) {
        if(res.error)
            return res.error;
      });
    return "OK";
}

exports.removeFaDefintion = function (Naziv) {
    sqlite.run('DELETE FROM FADefinition WHERE Naziv=?',[Naziv], function(res) {
        if(res.error)
            return res.error;
    });
    return "OK";
}

exports.updateFaDefintion = function (faDefintion) {
    const {Naziv, GeoTag, Tag} = faDefintion;

    sqlite.run("UPDATE FADefinition SET GeoTag=?, Tag=?  WHERE Naziv=?", [GeoTag, Tag, Naziv], function(res) {
        if(res.error)
            return res.error;
    });
    return "OK";
}

exports.getFaDefintions = function () {
    return sqlite.run('SELECT Naziv, GeoTag, Tag FROM FADefinition');
}
