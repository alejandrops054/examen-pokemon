const jwt = require('jsonwebtoken');
const moment = require('moment');

const authMiddleware = (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.query.token) {
            token = req.query.token;
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ error: 'Acceso no autorizado: Token no proporcionado' });
        }

        const secretKey = process.env.JWT_CLIENT_SECRET || req.app.get('jwt_key');
        if (!secretKey) {
            throw new Error('Clave secreta no definida');
        }

        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;

        next();
    } catch (err) {
        console.error('Error al verificar el token:', err.message);
        return res.status(401).json({ error: 'Acceso no autorizado: Token inválido o expirado' });
    }
};

module.exports = authMiddleware;