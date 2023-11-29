const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Stock = sequelize.define('stock', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type :Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true
    },
    price: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false

    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = Stock;