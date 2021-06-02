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

exports.getActiveNotActiveFadevice = (cb) => {

    pool.query('SELECT COUNT(*) FROM fadevice WHERE installationcode IS NOT NULL').then(res => {
        const countNotNull = res.rows[0].count

        pool.query('SELECT COUNT(*) FROM fadevice WHERE installationcode IS NULL').then(res2 => {
            const countNull = res2.rows[0].count
            cb({ active: countNotNull, notactive: countNull })
        }, err1 => {
            cb("Error")
        }).catch(err2 => {
            cb("Error")
        });
    }).catch(err => {
        cb("Error")
    });
}