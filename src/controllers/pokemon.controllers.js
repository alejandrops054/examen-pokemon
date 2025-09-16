const axios = require('axios');

const ObtenerPokemon = async (req, res) => {
    try {
        const { name } = req.params;

        if (!name || name.trim() === '') {
            return res.status(400).json({ mensaje: 'El nombre o ID del Pokémonémon es obligatorio' });
        }

        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);

        const pokemon = {
            id: response.data.id,
            nombre: response.data.name,
            tipo: response.data.types?.map(t => t.name) || [],
            peso: response.data.weight,
            altura: response.data.height,
            habilidades: response.data.abilities?.map(a => a.ability.name) || [],
            url_imagen: response.data.sprites?.other?.dream_world?.front_default || null
        };

        return res.status(200).json({
            mensaje: 'Pokémon encontrado',
            data: pokemon
        });

    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ mensaje: 'Pokémon no encontrado' });
        }
        console.error('Error al obtener Pokémonémon:', error.message);
        return res.status(500).json({mensaje: 'Error al obtener Pokémonémon' });
    }
};

module.exports = { ObtenerPokemon };