//importando la librería JWT
const jwt = require('jsonwebtoken');

//creando el middleware a ejecutar antes de las rutas protegidas
const verifyToken = (req, res, next) => {
    try {
        //obteniendo el header de athorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                status: 401,
                message: 'Token no proporcionado',
                data:null
            });
        }
//Separando el formato "Bearer TOKEN"
        const parts = authHeader.split(' ');
//Validando el formato correcto
        if (parts.length !==2 || parts[0] !== 'Bearer'){
            return res.status(401).json({
                status: 401,
                message: 'Formato de token inválido. Usa: Bearer <token>',
                data: null
            });
        }
        const token = parts[1]; //extrae el token real
        const decoded = jwt.verify(token, process.env.JWT_SECRET);// se verifica si el token es válido
        req.user = decoded; //se guardan los datos del usuario request
        next(); //si todo funciona correctamente, pasamos a la siguiente función

    } catch (error) {
        return res.status(403).json({
            status: 403,
            message: 'Token inválido o expirado',
            data: null
        });
    }
};

//Se exporta el middleware
module.exports = verifyToken;