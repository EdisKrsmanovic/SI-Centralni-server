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
        ssl: {rejectUnauthorized: false}
    }
);

exports.addFaDefintion = function (faDefintion, cb) {
    const {naziv, geotag, tag} = faDefintion;

    pool.query('INSERT INTO \"FADefinition\"(\"naziv\", \"geotag\", \"tag\") VALUES ($1::text,$2::text,$3::text)', [naziv, geotag, tag], dbResponse => {
        cb("OK")
    }, error => {
        cb("Error")
    });
}

exports.removeFaDefintion = function (id, cb) {
    pool.query('DELETE FROM \"FADefinition\" WHERE \"id\"=$1', [id], dbResponse => {
        cb("OK")
    }, error => {
        cb("Error")
    });
}

exports.updateFaDefintion = function (faDefinition, cb) {

    pool.query("UPDATE \"FADefinition\" SET \"naziv\"=$3::text, \"geotag\"=$1::text, \"tag\"=$2::text  WHERE id=$4", [faDefinition.geotag, faDefinition.tag, faDefinition.naziv, faDefinition.id], dbResponse => {
        cb("OK");
    }, error => {
        cb("Error");
    });
}

exports.getFaDefinitions = function (cb) {
    return pool.query('SELECT \"naziv\", \"geotag\", \"tag\" FROM \"FADefinition\"').then(dbResponse => {
        cb(dbResponse.rows)
    }, err1 => {
        cb("Error")
    });
}
