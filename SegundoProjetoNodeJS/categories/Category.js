const Sequelize = require('sequelize')
const conex = require('../database/database')

const Category = conex.define('categories', {
    title:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:
    {
        type: Sequelize.STRING,
        allowNull: false
    }
})



module.exports = Category