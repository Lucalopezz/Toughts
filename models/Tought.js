const { DataTypes } = require("sequelize");

const db = require('../database/conn')

const User = require('./User')

const Tought = db.define('Tought', {
    tittle: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    }
})

Tought.belongsTo(User)
User.hasMany(Tought)

module.exports = Tought