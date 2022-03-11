const Sequelize = require('sequelize')
const conex = require('../database/database')

const User = conex.define('users', {
    email:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    password:
    {
        type: Sequelize.STRING,
        allowNull: false
    }
})



module.exports = User