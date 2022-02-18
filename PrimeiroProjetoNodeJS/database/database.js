//importando e configurando o Sequelize
const Sequelize = require('sequelize')
var database = 'guiaperguntas'
var root = 'root'
var password = 'admin'
const connection = new Sequelize(database, root, password,{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection;