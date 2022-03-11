const express = require('express')
const router = express.Router()
const Category = require('./Category')
const slugify = require('slugify')
//body parser deve ser instanciado dentro do arquivo que será usado para gravar informações no banco de dados com formulários
const bodyParser = require('body-parser')

//chamando o middleware
const adminAuth = require('../middlewares/adminAuth')

//Body Parser (aplicação)
router.use(bodyParser.urlencoded({extended: false}))
router.use(bodyParser.json())

//rota para adicionar novas categorias
router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('admin/categories/new')
})

//salvando categorias
router.post('/categories/save', adminAuth, (req, res) => {
    var title = req.body.title
    if(title != undefined)
    {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories')
        })
    }
    else
    {
        res.redirect('/admin/categories/new')
    }
})

//listando as categorias
router.get('/admin/categories', adminAuth, (req,res) => {
    
    Category.findAll().then(categories => {
        res.render('admin/categories/index', {categories:categories})
    })
})

router.post('/categories/delete', adminAuth, (req,res) => {
    var id = req.body.id
    if(id != undefined)
    {
        if(!isNaN(id))//verifica se o valor é numérico ou não
        {
            //deletando de fato
            Category.destroy({
                where:
                {
                    id: id
                }
                }).then(() => {
                    res.redirect('/admin/categories') 
            })
        }
        else // se não for número
        {
            res.redirect('/admin/categories')
        }
    }
    else //se for nulo
    {
        res.redirect('/admin/categories')
    }
    
})

//edição de categorias
router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    var id = req.params.id
    if(isNaN(id))
    {
        res.redirect('/admin/categories')
    }
    //pesquisa pelo id
    Category.findByPk(id).then(category => {
        if(category != undefined)
        {
            res.render('admin/categories/edit',{category: category})
        }
        else
        {
            res.redirect('/admin/categories')
        }
    }).catch(erro => {
        res.redirect('/admin/categories')
    })
})

router.post('/categories/update', adminAuth, (req, res) => {
    var id = req.body.id
    var title = req.body.title

    Category.update({title: title, slug: slugify(title)},{
        where:{
            id: id
        }
    }).then(() => {
        res.redirect('/admin/categories')
    })
})

module.exports = router