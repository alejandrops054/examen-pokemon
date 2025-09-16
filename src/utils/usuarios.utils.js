const {queryPool} = require('./conexion');

const consultarUsuarios = async (filtros = {}) => {
    try {
        if (typeof filtros !== 'object' || Array.isArray(filtros) || filtros === null) {
            throw new Error('Los filtros deben ser un objeto válido');
        }

        const { id, nombre_usuario, correo, perfil } = filtros;

        const condiciones = [];
        const parametros = [];

        if (id) {
            condiciones.push('id = ?');
            parametros.push(id);
        }

        if (nombre_usuario !== undefined && nombre_usuario !== null && nombre_usuario.trim() !== '') {
            condiciones.push('LOWER(nombre_usuario) LIKE ?');
            parametros.push(`%${nombre_usuario.trim()}%`);
        }

        if (correo !== undefined && correo !== null && correo.trim() !== '') {
            condiciones.push('correo LIKE ?');
            parametros.push(`%${correo.trim()}%`);
        }

        if (perfil !== undefined && perfil !== null && perfil !== '') {
            condiciones.push('perfil = ?');
            parametros.push(perfil);
        }

        const clausulaWhere = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';

        const consulta = `
      SELECT 
        id, 
        nombre_usuario,
        password,
        correo, 
        perfil
      FROM usuarios
      ${clausulaWhere}
      ORDER BY fecha_creacion DESC
    `;

        const resultado = await queryPool(consulta, parametros);

        const usuarios = Array.isArray(resultado) ? resultado : [];

        return {
            datos: usuarios,
            total: usuarios.length,
            mensaje: 'Consulta realizada con éxito'
        };

    } catch (error) {
        console.error('Error en consultarUsuarios:', error.message);
        throw new Error('Error al consultar los usuarios: ' + error.message);
    }
};

const InsertarRegistrosUsuarios = async (datos) => {
    try {
        const { nombre_usuario, correo, hashedPassword, perfil } = datos;
        console.log(hashedPassword)

        if (!nombre_usuario || !correo || !perfil) {
            throw new Error('Faltan datos obligatorios: nombre_usuario, correo o perfil');
        }

        const insert = `
            INSERT INTO usuarios (nombre_usuario, correo, password, perfil, fecha_creacion)
            VALUES (?, ?, ?, ?, NOW())`;

        const parametros = [nombre_usuario, correo, hashedPassword, perfil, ];

        const result = await queryPool(insert, parametros);

        return result;
    } catch (error) {
        console.error('Error en InsertarRegistrosUsuarios:', error.message);
        throw new Error('Error al insertar los usuarios: ' + error.message);
    }
}

const ActualizarRegistrosUsuarios = async (set = {}, where = {}) => {
    try {
        if (Object.keys(set).length === 0) {
            throw new Error('No hay datos para actualizar');
        }
        if (Object.keys(where).length === 0) {
            throw new Error('No hay condiciones para actualizar');
        }


        const campos = Object.keys(set);
        const valores = Object.values(where);

        let query = 'UPDATE usuarios SET ';

        query += campos.map((campo) => `${campo} = ?`).join(', ');

        const whereCampos = Object.keys(where);
        const whereValores = Object.values(where);

        query += ' WHERE ';
        query += whereCampos.map((campo) => `${campo} = ?`).join(' AND ');

        const queryParams = [...valores, ...whereValores];

        const result = await queryPool(query, queryParams);

        if (!result || result.affectedRows === 0) {
            throw new Error('No se encontraron registros para actualizar.');
        }

        return result;
    } catch (error) {
        console.error('Error en ActualizarRegistrosUsuarios:', error.message);
        throw new Error('Error al actualizar los usuarios: ' + error.message);
    }
}

const EliminarUsuario = async (id) => {
    try{
        if(!id){
            throw new Error('El id del usuario es obligatorio para eliminar.');
        }

        const deleteQuery = 'DELETE FROM usuarios WHERE id = ?';
        const result = await queryPool(deleteQuery, [id]);
        if(!result || result.affectedRows === 0){
            throw new Error('No se encontró el usuario con el id proporcionado.');
        }
        return result;
    }catch(error){
        console.error('Error en EliminarUsuario:', error.message);
        throw new Error('Error al eliminar el usuario: ' + error.message);
    }
}
module.exports = {
    consultarUsuarios,
    InsertarRegistrosUsuarios,
    ActualizarRegistrosUsuarios,
    EliminarUsuario
};