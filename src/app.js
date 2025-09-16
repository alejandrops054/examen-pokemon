const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');

const UsuariosRoutes = require('./routes/usuario.routes');
const PokemonRoutes = require('./routes/pokemon.routes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());



app.use(express.static(path.join(__dirname, '../public')));
app.use('/api', UsuariosRoutes, PokemonRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    return res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;