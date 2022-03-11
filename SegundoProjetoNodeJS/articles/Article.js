const Sequelize = require('sequelize')
const conex = require('../database/database')
const Category = require("../categories/Category")

const Article = conex.define('articles', {
    title:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    body:
    {
        type: Sequelize.TEXT,
        allowNull: false
    }

})

//definindo a relação com "Category"
Category.hasMany(Article)//uma categoria tem muitos artigos -> 1 para N
Article.belongsTo(Category)//um artigo pertence a uma categoria -> 1 para 1


module.exports = Article