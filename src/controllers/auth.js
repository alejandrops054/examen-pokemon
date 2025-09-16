const jwt = require('jsonwebtoken');

const ValidateToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ valid: false, message: 'Acceso no autorizado: Token no proporcionado' });
        }

        const secretKey = process.env.JWT_CLIENT_SECRET;
        if (!secretKey) {
            throw new Error('Clave secreta no definida');
        }

        const decoded = jwt.verify(token, secretKey);

        return res.status(200).json({ valid: true, user: decoded });
    } catch (error) {
        console.error('Error al validar el token:', error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ valid: false, message: 'Acceso no autorizado: Token expirado' });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ valid: false, message: 'Acceso no autorizado: Token inválido' });
        }

        return res.status(500).json({ valid: false, message: 'Error interno del servidor' });
    }
};

module.exports = {
    ValidateToken,
};