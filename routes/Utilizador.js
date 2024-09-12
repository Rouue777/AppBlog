import { Model } from "sequelize";
import sequelize from "../models/Bd.js";
import Usuarios from "../models/Usuarios.js";
import express from 'express'
import bcrypt from 'bcryptjs'
import passport from "passport";
import eAdmin from "../helpers/eAdmin.js";

const router = express.Router()

router.get('/registro', (req,res) =>{
    res.render('usuario/registro')
})

//criando registo na DB
router.post('/registro', async (req,res) =>{ 
    let erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto : 'Nome Vazio'})
    }
    
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto : 'Email Vazio'})
    }
    
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto : 'Senha Vazia'})
    }

    if(req.body.senha.length < 4){
        erros.push({texto : 'Senha muita curta'})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: 'A senha de confirmação deve ser igual a primeira senha!'})
    }

    if(erros.length > 0){
        res.render('usuario/registro', {
            erros : erros
        })
    }else{
        //caso os dados estejam todos corretos
    Usuarios.findOne({where:{email: req.body.email}}).then((email)=>{
        if(email){
            req.flash('error_msg', 'Email já cadastrado, Cadastre um novo email.')
            res.redirect('/usuario/registro')
        }else{
            //hashear senha
            const novoUsuario = new Usuarios({
                nome : req.body.nome,
                email : req.body.email,
                senha : req.body.senha
            })

            bcrypt.genSalt(10, (erro, salt) => {
                bcrypt.hash(req.body.senha, salt, (erro, hash) => {
                    if(erro){
                        req.flash('error_msg', 'Houve durante o salvamento do usuario')
                    }else{
                        novoUsuario.senha = hash

                        novoUsuario.save().then(()=>{
                            req.flash('success_msg', 'Cadastro feito com sucesso')
                            res.redirect('/')
                        }).catch((err) =>{
                            req.flash('error_msg', 'Houve um erro ao criar contar, Tente novamente')
                            res.redirect('/usuario/registro')
                        })
                    }
                })
            }).then(()=>{
                console.log('Tudo certo')
            }).catch((err)=> {
                console.log('Erro na criação do salt' + err)
            })



 
        }
    }).catch((err) =>{
        
    })

    }


})

router.get('/login', (req,res)=>{
    res.render('usuario/login')
})

router.post('/login',(req, res, next) =>{
    passport.authenticate('local',{
        successRedirect : '/',
        failureRedirect : '/usuario/login',
        failureFlash: true
    })(req,res,next)
    console.log(`Aqui a variavel ${eAdmin}`)
})

router.get('/logout', (req,res) =>{
    req.logOut((err) =>{
        if(err){
            req.flash('error_msg', 'Por algum motivo houve erro ao deslogar' + err)
        }else{
            req.flash('success_msg', 'Deslogado com sucesso')
            res.redirect('/')
        }
    })

  

})

export default router;