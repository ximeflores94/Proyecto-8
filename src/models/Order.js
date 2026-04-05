const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define(
    'Order',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },

        total: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'orders',
        timestamps: true
    }
);

module.exports = Order;