
const bcrypt = require('bcrypt');
const {
    consultarUsuarios,
    InsertarRegistrosUsuarios,
    ActualizarRegistrosUsuarios,
    EliminarUsuario
} = require('../utils/usuarios.utils');
const {createTokenForUser} = require('../utils/jwt');

const ObtenerUsuarios = async (req, res) => {
    try {
        const filtros = req.query || {};

        if (typeof filtros !== 'object' || Array.isArray(filtros)) {
            return res.status(400).json({ error: 'Los filtros deben ser un objeto.' })
        }

        const resultado = await consultarUsuarios(filtros);

        if (!resultado || (Array.isArray(resultado.datos) && resultado.datos.length === 0)) {
            return res.status(404).json({ error: 'No se encontraron almacenes con los filtros proporcionados.' });
        }

        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error en ConsultarUsuarios:', error.message);
        res.status(500).json({ mensaje: 'Error al consultar los usuarios: ' + error.message });
    }
};

const RegistrarUsuario = async (req, res) => {
    try {
        const { nombre_usuario, correo, contrasena, perfil, id_usuario } = req.body;

        if (!nombre_usuario || !correo || !contrasena || !perfil) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
        }

        const resultadoPerfil = await consultarUsuarios({id: id_usuario});
        if(resultadoPerfil.datos.perfil !== "admin"){
            res.status(400).json({mensaje: 'Tu perfil no es de administrador'});
        }

        const resultadoUsuario = await consultarUsuarios({ nombre_usuario });
        if (resultadoUsuario.datos.length > 0) {
            return res.status(400).json({ mensaje: "El nombre de usuario ya está en uso" });
        }

        const resultadoCorreo = await consultarUsuarios({ correo });
        if (resultadoCorreo.datos.length > 0) {
            return res.status(400).json({ mensaje: "El correo electrónico ya está registrado" });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        try {
            await InsertarRegistrosUsuarios({
                nombre_usuario,
                correo,
                hashedPassword,
                perfil
            });
        } catch (error) {
            console.error('Error al insertar el usuario:', error.message);
            return res.status(500).json({ mensaje: 'Error al insertar el usuario: ' + error.message });
        }

        res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
    } catch (error) {
        console.error('Error en RegistrarUsuario:', error.message);
        res.status(500).json({ mensaje: 'Error al registrar el usuario: ' + error.message });
    }
};

const Login = async(req, res) => {
    try {
        const {correo, password} = req.body;

        if(!correo || !password){
            return res.status(400).send({message: 'Correo y contraseña son obligatorios'});
        }

        const usuarios = await consultarUsuarios({correo});
        
        if (!usuarios || usuarios.length === 0) {
            return res.status(404).json({ message: 'No existe esta cuenta.' });
        }

        const usuario = usuarios.datos[0];
         const passwordMatch = await bcrypt.compare(password, usuario.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        const token = createTokenForUser(usuario,);

        return res.status(200).json({message: "inicio sesion", token});
    } catch (error) {
        console.error('Error', error.message);
        res.status(500).json({mensaje: 'Error al iniciar sesion' + error.message});
    }
}

const ActualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_usuario, correo, contrasena, perfil } = req.body;

        if (!id) {
            return res.status(400).json({ mensaje: 'El ID del usuario es obligatorio' });
        }

        const datosActualizacion = {};

        if (nombre_usuario !== undefined) datosActualizacion.nombre_usuario = nombre_usuario;
        if (correo !== undefined) datosActualizacion.correo = correo;
        if (perfil !== undefined) datosActualizacion.perfil = perfil;

        if (contrasena !== undefined) {
            datosActualizacion.contrasena = await bcrypt.hash(contrasena, 10);
        }

        if (Object.keys(datosActualizacion).length === 0) {
            return res.status(400).json({ mensaje: 'No se proporcionaron campos para actualizar' });
        }

        const resultado = await ActualizarRegistrosUsuarios(id, datosActualizacion);

        if (!resultado || resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado o sin cambios' });
        }

        res.status(200).json({ mensaje: 'Usuario actualizado con éxito', datos: datosActualizacion });
    } catch (error) {
        console.error('Error en ActualizarUsuario:', error.message);
        res.status(500).json({ mensaje: 'Error al actualizar el usuario: ' + error.message });
    }
};

const EliminarUsuarios = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ mensaje: 'El ID del usuario es obligatorio' });
        }

        const resultado = await EliminarUsuario(id);

        if (!resultado || resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.status(200).json({ mensaje: 'Usuario eliminado con éxito' });
    } catch (error) {
        console.error('Error en EliminarUsuario:', error.message);
        res.status(500).json({ mensaje: 'Error al eliminar el usuario: ' + error.message });
    }
};

module.exports = {
    ObtenerUsuarios,
    RegistrarUsuario,
    Login,
    ActualizarUsuario,
    EliminarUsuarios
};