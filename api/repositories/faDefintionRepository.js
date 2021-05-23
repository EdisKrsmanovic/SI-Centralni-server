const sqlite = require('sqlite-sync');
const bcrypt = require("bcrypt");
sqlite.connect('baza.db')
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

exports.addFaDefintion = function (faDefintion) {
    const {Naziv, GeoTag, Tag} = faDefintion;

    pool.query('INSERT INTO \"FADefinition\"(\"naziv\", \"geotag\", \"tag\") VALUES ($1::text,$2::text,$3::text)',[Naziv, GeoTag, Tag], function(res) {
        if(res.error)
            return res.error;
      });
    return "OK";
}

exports.removeFaDefintion = function (Naziv) {
    pool.query('DELETE FROM \"FADefinition\" WHERE \"naziv\"=$1::text',[Naziv], function(res) {
        if(res.error)
            return res.error;
    });
    return "OK";
}

exports.updateFaDefintion = function (faDefintion) {
    const {Naziv, GeoTag, Tag} = faDefintion;

    pool.query("UPDATE \"FADefinition\" SET \"geotag\"=$1::text, \"tag\"=$2::text  WHERE \"naziv\"=$3::text", [GeoTag, Tag, Naziv], function(res) {
        if(res.error)
            return res.error;
    });
    return "OK";
}

exports.getFaDefintions = function () {
    return pool.query('SELECT \"naziv\", \"geotag\", \"tag\" FROM \"FADefinition\"').then(dbResponse=> {
        console.log('FA Definitions successfully retrieved.');
        console.log(dbResponse);
      }, err1 => {
        console.log("Error " + err1.message);
    });
}
