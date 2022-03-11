const express = require('express')
const router = express.Router()
const Article = require("./Article")
const slugify = require('slugify')

//chamando o middleware
const adminAuth = require('../middlewares/adminAuth')

//carregando o módulo de categorias para o dropdown
const Category = require('../categories/Category')

//body parser deve ser instanciado dentro do arquivo que será usado para gravar informações no banco de dados com formulários
const bodyParser = require('body-parser')

//Body Parser (aplicação)
router.use(bodyParser.urlencoded({extended: false}))
router.use(bodyParser.json())


router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        //chamando o camppo título a ser exibido na tabela de artigos
        //titulo da categoria
        include: [{model: Category}]
    }).then(articles => {
        res.render('admin/articles/index', {articles: articles})
    })
})

router.get('/admin/articles/new', adminAuth, (req, res) =>{
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories})
    })
    
})

router.post('/articles/save', adminAuth, (req, res) =>{
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        //foreign key (chave estrangeira)
        categoryId: category
    }).then(() => {
        res.redirect('/admin/articles')
    })
})

router.post('/articles/delete', adminAuth, (req,res) => {
    var id = req.body.id
    if(id != undefined)
    {
        if(!isNaN(id))//verifica se o valor é numérico ou não
        {
            //deletando de fato
            Article.destroy({
                where:
                {
                    id: id
                }
                }).then(() => {
                    res.redirect('/admin/articles') 
            })
        }
        else // se não for número
        {
            res.redirect('/admin/articles')
        }
    }
    else //se for nulo
    {
        res.redirect('/admin/articles')
    }
    
})

/*
+++DESAFIO+++
*/
//edição de artigos
//pegando dados
router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    var id = req.params.id
    //pesquisa pelo id
    Article.findByPk(id).then(article => {
        if(article != undefined)
        {
            Category.findAll().then(categories =>{
                res.render('admin/articles/edit',{categories: categories, article: article})
            })
            
        }
        else
        {
            res.redirect('/admin/articles')
        }
    }).catch(err => {
        res.redirect('/admin/articles')
    })
})
//atualizando dados
router.post('/articles/update', adminAuth, (req, res) => {
    var id = req.body.id
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.update({title: title, 
            slug: slugify(title),
            body: body,
            //foreign key (chave estrangeira)
            categoryId: category},{
        where:{
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    }).catch(err => {
        res.redirect('/')
    })
})

//paginação
router.get('/articles/page/:num', (req, res) =>{
    var page = req.params.num
    var offset = 0
    if(isNaN(page) || page == 1)
    {
        offset = 0
    }
    else
    {
        offset = parseInt(page - 1) * 4
    }

    //metodo que retorna o findAll com uma contagem 
    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order:[
            ['id', 'DESC']
        ]
    }).then(articles => {
        //verificando se está na última página
        var next
        if(offset + 4 >= articles.count){
            next = false
        }
        else
        {
            next = true
        }
        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories =>{
            res.render('admin/articles/page',{result: result, categories: categories})
        })
        //res.json(result)
    })

})


module.exports = router