const express = require('express');
const ControladorPokemon = require('../controllers/pokemon.controllers');
const authMiddleware = require('../middleware/auth');
const throttle = require('../middleware/throttle.middleware');

const api = express.Router();

api.get('/pokemon/:name', authMiddleware, throttle, ControladorPokemon.ObtenerPokemon);

module.exports = api;