const express = require('express');
const ControladorUsuario = require('../controllers/usuarios.controllers');
const ControladorAuth = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');


const api = express.Router();

//El GET puede recibir valores en su query url para buscar el id de usuario
api.get('/auth/users', authMiddleware, ControladorUsuario.ObtenerUsuarios);

api.post('/auth/registro', authMiddleware, ControladorUsuario.RegistrarUsuario);
api.post('/auth/login', ControladorUsuario.Login);
api.post('/auth/validar-token', ControladorAuth.ValidateToken);
api.patch('/auth/users/:id', authMiddleware, ControladorUsuario.ActualizarUsuario);
api.delete('/auth/users/:id', authMiddleware, ControladorUsuario.EliminarUsuarios);

module.exports = api;