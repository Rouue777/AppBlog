//importações
import express from 'express';
import { create } from 'express-handlebars';
import bodyParser from 'body-parser';
import Admin from './routes/Admin.js';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './models/Bd.js';
import { Sequelize } from 'sequelize';
import session from 'express-session';
import flash from 'connect-flash';
import router from './routes/Admin.js';
import postagens from './models/postagens.js';
import categorias from './models/categorias.js';
import Utilizador from './routes/Utilizador.js'
import passport from 'passport';
import configPassport from './config/auth.js';
import eAdmin from './helpers/eAdmin.js';
configPassport(passport)

//
//instanciando
const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//configuracoes
//sessão
app.use(session({
    secret: "cursonode",
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
//flash
app.use(flash())

//midleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null ;
    res.locals.eadmin = req.user || null;
    next()
})
    
//bodyparser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//handlebars
const handlebars = create({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars')


//Public
app.use(express.static(path.join(__dirname, "public")))

//rotas
//grupo de rotas pag administracao
app.get('/', (req, res) => {
    postagens.findAll({
        include: [
            {
                model: categorias,
                as: 'categorias'
            }
        ]
    }).then((postagem) => {
        res.render('index', {
            postagem: postagem
        })
    }).catch((err) => {
        req.flash('error_msg', "houve um erro interno ao selecionar postagens")
        res.redirect('/404')
    })
})

app.get('/postagens/:slug', (req, res) => {
    postagens.findOne({ where: { slug: req.params.slug } }).then((postagem) => {
        if (postagem) {
            res.render('postagem/index', { postagem: postagem })
        } else {
            req.flash('error_msg', 'Erro ao encontrar postagem')
            res.redirect('/')
        }
    }).catch((err) => {
        req.flash('error_msg', 'Essa postagem não existe' + err)
        res.redirect('/')
    })

})

app.get('/categorias', (req, res) => {
    categorias.findAll().then((categoria) => {
        res.render('categorias/index', {
            categoria: categoria
        })
    }).catch('error_msg', "Houve um erro interno ao localizar categorias")
})

//rota para listar postagens relacionadas a categoria
app.get('/categorias/:slug', (req, res) => {
    categorias.findOne({ where: { slug: req.params.slug } }).then((categoria) => {
        if (!categoria) {
            req.flash('error_msg', 'Essa categoria não existe' + err)
            res.redirect('/')
        } else {
            postagens.findAll({ where: { categoriasId: categoria.id } }).then((postagem) => {
                res.render('categorias/postagens', {
                    postagem: postagem,
                    categoria: categoria
                })
            }).catch((err) => {
                req.flash('error_msg', 'HOuve um erro ao localizar postagens' + err)
                res.redirect('/')
            })
        }

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno ao localizar categorias")
    })

})


app.get('/404', (req, res) => {
    res.send('Error 404')
})

app.use('/admin', Admin)
app.use('/usuario', Utilizador)



//outros




console.log(sequelize instanceof Sequelize);


//rodando server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('rodando url http://localhost3001')
})
