const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config();

const dbRegex = /mysql:\/\/(.*)[:](.*)[@](.*)[:](.*)[/](.*)/g;
const match = dbRegex.exec(process.env.MYSQL);

const pool = mysql.createPool({
  host: match[3],
  user: match[1],
  port: match[4],
  database: match[5],
  password: match[2],
  waitForConnections: true,
  connectionLimit: 3
});
const db = pool.promise();

exports.db = db;
