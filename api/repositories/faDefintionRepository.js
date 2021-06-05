
const bcrypt = require("bcrypt");
const pg = require('pg');
const pool = new pg.Pool({
       user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: {rejectUnauthorized: false}


      /*
     // Ignore this, i need it J.D.
      user: 'postgres',
    host: '127.0.0.1',
    database: 'SI-DB',
    password: '1234',
    port: 5432,
*/
    }
      
);

exports.addFaDefintion = function (faDefintion, cb) {
    const {naziv, geotag, tag} = faDefintion;

    pool.query('INSERT INTO \"fadevice\"(\"devicename\", \"geotag\", \"tag\") VALUES ($1::text,$2::text,$3::text)', [naziv, geotag, tag], dbResponse => {
        cb("OK")
    }, error => {
        cb("Error")
    });
}

exports.removeFaDefintion = function (id, cb) {
    pool.query('DELETE FROM \"fadevice\" WHERE \"deviceid\"=$1', [id], dbResponse => {
        cb("OK")
    }, error => {
        cb("Error")
    });
}

exports.updateFaDefintion = function (faDefinition, cb) {

    pool.query("UPDATE \"fadevice\" SET \"devicename\"=$3::text, \"geotag\"=$1::text, \"tag\"=$2::text  WHERE deviceid=$4", [faDefinition.geotag, faDefinition.tag, faDefinition.naziv, faDefinition.id], dbResponse => {
        cb("OK");
    }, error => {
        cb("Error");
    });
}

exports.getFaDefinitions = function (cb) {
    return pool.query('SELECT \"deviceid\" AS \"id\", \"devicename\" AS \"naziv\", \"geotag\", \"tag\" FROM \"fadevice\"').then(dbResponse => {
        cb(dbResponse.rows)
    }, err1 => {
        console.log(err1);
        cb("Error")
    });
}

exports.getFaDefinitionById = function (id,cb) {
    return pool.query('SELECT \"deviceid\" AS \"id\", \"devicename\" AS \"naziv\", \"geotag\", \"tag\" FROM \"fadevice\" WHERE \"deviceid\"=$1',[id]).then(dbResponse => {
        cb(dbResponse.rows[0])
    }, err1 => {
        cb("Error")
    });
}

exports.pool = { pool }