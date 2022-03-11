//Express 
const express = require('express')
const app = express()
//Express-Session
const session = require('express-session')
const conex = require('./database/database')
//Body Parser (configuração)
const bodyParser = require('body-parser')

//Importando o router
const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const usersController = require('./users/UsersController')

//importando models
const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./users/User')

//View engine (EJS)
app.set("view engine", "ejs")

//Sessions
app.use(session({
    secret: 'Kingzobullshitbackinfulleffect92', //nome de um disco do De Falla
    cookie:{maxAge: 300000000
    }
}))


//Arquivos estáticos
app.use(express.static('public'))


//Database
conex
    .authenticate()
    .then(() => {
        console.log('Conexão muito bem sucedida!!')
    })
    .catch((error) =>{
        console.log(error)
    })

app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', usersController)

//Sessões de exemplo
/*
app.get('/session',(req, res) =>{
    req.session.treinamento = 'Formação NodeJS'
    req.session.ano = 2022
    req.session.email = 'virgilio.teixeira@outlook.com'
    req.session.user ={
        username: 'virgilioteixeira',
        email: 'virgilio.teixeira@outlook.com',
        id: 21
    }
    res.send('Sessão gerada!')//necessária a resposta na rota
})

app.get('/leitura',(req, res) =>{
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user
    })
})
*/

//Body Parser (aplicação)
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//importando artigos para a página index do programa
app.get('/', (req,res) => {
    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories =>{
            res.render('index.ejs',{articles:articles, categories:categories})
        })
    })
})    

app.get('/:slug', (req, res) => {
    var slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined)
        {
            Category.findAll().then(categories =>{
                res.render('article',{article:article, categories:categories})
            })
        }
        else
        {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        //incluindo na busca todos os artigos que fazem parte dela
        include:[{model: Article}]
    }).then (category =>{
        if(category != undefined)
        {

            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories})
            })

        }
        else
        {
            res.redirect('/')
        }       
    }).catch( err =>{
        res.redirect('/')
    }) 
})

app.listen(2525, () => {
    console.log("Servidor rodando!!")
})