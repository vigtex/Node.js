const Sequelize = require('sequelize')
var database = 'vtblog'
var root = 'root'
var password = 'admin'
const conex = new Sequelize(database, root, password,{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = conex;