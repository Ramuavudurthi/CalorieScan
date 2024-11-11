// models/Food.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust to your database configuration

const Food = sequelize.define('Food', {
    name: { type: DataTypes.STRING, allowNull: false },
    weight: { type: DataTypes.FLOAT, allowNull: false },
    calories: { type: DataTypes.FLOAT, allowNull: false },
    proteins: { type: DataTypes.FLOAT, allowNull: false },
    carbohydrates: { type: DataTypes.FLOAT, allowNull: false },
    fats: { type: DataTypes.FLOAT, allowNull: false },
});

module.exports = Food;
