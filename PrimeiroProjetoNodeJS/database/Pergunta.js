//Boa prática: models começam com letra maiúscula

//conexão com database
const Sequelize = require('sequelize')
const connection = require('./database')

const Pergunta = connection.define('perguntas',{//definindo nome da tabela
    //campos
    titulo:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    pergunta:
    {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Pergunta.sync({force: false}).then(() => {})//sincroniza com o banco de dados
//false, se a tabela já existe, não é criada

//exportando o model
module.exports = Pergunta
