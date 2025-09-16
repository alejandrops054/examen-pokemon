const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mysql = require('mysql2/promise');

const dbConnectionConfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
};

const pool = mysql.createPool(dbConnectionConfig);
pool.on('connection', (connection) => {
    console.log('Conexión a la base de datos (pool) establecida correctamente');
    connection.query('SET SESSION wait_timeout = 28800');
});

pool.on('error', (err) => {
    console.error('Error en la conexión a la base de datos (pool):', err);
});


module.exports = {
    pool
}