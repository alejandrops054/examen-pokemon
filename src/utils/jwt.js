const jwt = require('jwt-simple');
const moment = require('moment');

const secretUser = process.env.JWT_CLIENT_SECRET;

exports.createTokenForUser = function (usuario) {
    const expirationTime = moment().add(1, 'day').unix();

    const payload = {
        id: usuario.id,
        id_perfil: usuario.id_perfil,
        email: usuario.email,
        iat: moment().unix(),
        exp: expirationTime,
    };

    return jwt.encode(payload, secretUser);
};