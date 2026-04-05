//Importando los tipos de datos de Sequelize
const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const User = sequelize.define(
    'User',
    {
        //ID del usuario - Clave primaria
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }, 

        //nombre del usuario de caracter obligatorio
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },

        //Email del usuario
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // con esto, el mail no se puede repetir
            validate: {
                isEmail: true // con esto se valida el formato del mail
            }
        },
        //Contraseña
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'users',
        timestamps: true
    }
);

// Exportando el modelo
module.exports = User;