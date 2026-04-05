//importando conexión
const sequelize = require('../config/database');
const User = require('./User');
const Order = require('./Order');

//Relación 1:N
User.hasMany(Order, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Order.belongsTo(User, {
    foreignKey: 'userId'
});

const db = {
    sequelize,
    User,
    Order
};

//Exportando todo
module.exports = db;

