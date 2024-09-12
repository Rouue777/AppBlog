//importando frameworks
import localstrategy from 'passport-local';
import { Sequelize } from 'sequelize';
import bCrypt from 'bcryptjs';

//importando models
import Usuarios from '../models/Usuarios.js'


export default function (passport) {
    passport.use(new localstrategy({ usernameField: 'email', passwordField: 'senha' }, (email, senha, done) => {

        Usuarios.findOne({ where: { email: email } }).then((usuario) => {
            if (!usuario) {
                return done(null, false, { message: 'Esta conta não existe' })
            }

            bCrypt.compare(senha, usuario.senha, (erro, batem) => {
                if (batem) {
                    return done(null, usuario)
                } else {
                    return done(null, false, { message: 'Senha incorreta' })
                }
            })

        }).catch((err) => { console.log('erro' + err) })

    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done) => {
        Usuarios.findOne({ where: { id: id } })
            .then(usuario => {
                console.log(usuario)
                done(null, usuario);
            })
            .catch(err => {
                console.error('Erro ao deserializar usuário:', err);
                done(err, null);
            });
    });



}