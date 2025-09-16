const  {pool} = require('../config/database')
const queryPool = async (sql, params) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [results] = await connection.query(sql, params);
        return results;
    } catch (error) {
        console.error('Error en la consulta a la base de datos:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { queryPool };