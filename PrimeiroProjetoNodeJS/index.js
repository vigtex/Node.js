//configurando Express
const express = require('express')
const app = express()

//configurando Body-Parser (patura de dados nos formulários)
const bodyParser = require('body-parser')

//importando a conexão com o banco de dados 
const connection = require('./database/database')

//criando/importando o model e a tabela perguntas para salvar no banco de dados
const Pergunta = require('./database/Pergunta')

//criando/importando o model e a tabela respostas para salvar no banco de dados
const Resposta = require('./database/Resposta')

//chamando a conexão com o banco de dados
connection
    .authenticate()
    .then(() => {
        console.log('Conexão bem sucedida com o banco de dados!')
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })

//chamando Body-Parser no Express
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())//permite a leitura de dados de formulários via JSon (amis utilizado em APIs)


//chamando o EJS no Express
app.set('view engine', 'ejs')

//definindo o uso de arquivos estáticos
app.use(express.static('public'))

app.listen(1515,()=>{
    console.log('App rodando!!!')
})

app.get('/perguntar',(req, res) =>{
    res.render('perguntar.ejs')
})

app.get('/',(req,res) => {
    //listando as perguntas do banco de dados na página principal
    Pergunta.findAll({raw:true, order:[
        ['id','DESC']//ordena em ordem descrescente pelo ID
        //ASC -> crescente
        //DESC -> descrescente
    ]}).then(perguntas =>{
        res.render('index.ejs',{
            //váriavel que receberá as perguntas do banco de dados
            //reponsável por trazer estes dados para o front end
            perguntas: perguntas
        })
    })
})

//metodo para envio dos dados (não captura, envio)
//metodo post pois será utlizado este método
app.post('/salvarpergunta', (req, res)=>{
    var titulo = req.body.tit
    var pergunta = req.body.per
    //salvando os dados na tabela pergunta do banco de dados
    Pergunta.create({
        titulo: titulo,
        pergunta: pergunta
    }).then(() => {
        //redirecionando o usuário para a página principal
        res.redirect('/')
    })
})

//rota para resposta a pergunta específica
app.get('/resposta/:id',(req, res) => {
    var id = req.params.id
    //metodo que vai buscar na database um dado específico
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta =>{
        if(pergunta != undefined)//verificando se existe a pergunta
        {
            //listando as respostas as perguntas na rota/página
            Resposta.findAll({
                where: {
                    perguntaId: pergunta.id
                },
                order: [['id', 'DESC']]
            }).then(respostas =>{
                res.render('resposta',{
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
            
            
        }
        else //pergunta não encontrada
        {
            res.redirect('/')//redirecionamento para a página principal
        }
    })
})

//rota para os dados do formulário de resposta
app.post('/responder',(req, res) => {
    var corpo = req.body.corpo
    var perguntaId = req.body.perguntaId
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('/resposta/' + perguntaId) 
    })
})