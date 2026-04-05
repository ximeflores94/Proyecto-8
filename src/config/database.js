//importando el archivo Sequelize
const { Sequelize } = require('sequelize');

//Leyendo las variables del archivo .env
require('dotenv').config();

//Creando la conexión a PostgreSQL usando los datos del .env
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
       host: process.env.DB_HOST,
       dialect: 'postgres',
       port: process.env.DB_PORT,
       logging: false
    }
);

//exportando la conexión para usarla en otros archivos
module.exports = sequelize;
