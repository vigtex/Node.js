const express = require('express')
const router = express.Router()
const User = require('./User')

//chamando o middleware
const adminAuth = require('../middlewares/adminAuth')

//bcryptjs para codificação de senhas de usuários por hash
const bcrypt = require('bcryptjs')

//body parser deve ser instanciado dentro do arquivo que será usado para gravar informações no banco de dados com formulários
const bodyParser = require('body-parser')

//Body Parser (aplicação)
router.use(bodyParser.urlencoded({extended: false}))
router.use(bodyParser.json())

router.get('/admin/users', adminAuth, (req, res) => {
    
    User.findAll().then(users =>{
        res.render("admin/users/index", {users:users})
    })
})

router.get('/admin/users/create', (req, res) => {
    res.render("admin/users/create")
})

router.post('/users/create', adminAuth, (req, res) => {
    var email = req.body.email
    var password = req.body.password

    //verificando a duplicidade de e mail    
    User.findOne({where:{email: email}}).then(user =>{
        if(user == undefined)//e mail não cadastrado ainda
        {
            //usando bcrypt
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password, salt)
            User.create({
            email: email,
            password: hash
            }).then(()=>{
             res.redirect('/admin/users')
            }).catch((err) => {
             res.redirect('/')
    })
        }
        else//e mail já cadastrado
        {
            
            res.redirect('/admin/users/create')
        }
    })

    
    
    //IMPORTANTE
    /* fazer um teste se os dados estão chegando com o JSon antes de gravar no banco.
     *res.json({email, password})
     */
})

router.get('/login',(req,res)=> {
    res.render('admin/users/login')
})

router.post('/authenticate',(req, res) =>{
    var email = req.body.email
    var password = req.body.password
    
    User.findOne({where: {email: email}}).then(user => {
        //verificando a existênia do usuário
        if(user != undefined)
        {
            //validação da senha
            var correct = bcrypt.compareSync(password, user.password)
            if(correct)
            {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/users')
            }
            else
            {
                res.redirect('/login')
            }
        }
        else
        {
            res.redirect('/login')
        }
    })
})

router.get('/logout', adminAuth, (req, res) =>{
    req.session.user = undefined
    res.redirect('/')
})

/*
 *Linha usada para criar a tabela no banco de dados
User.sync({force: true})
*/
//force true - sempre irá criar uma nova tabela
//force false - se a tabela já existe, não irá criar, senão será criada nova tabela


module.exports = router