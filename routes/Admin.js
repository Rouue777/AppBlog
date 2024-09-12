import express from "express"
import categorias from "../models/categorias.js";
import postagens from "../models/postagens.js";
import sequelize from "../models/Bd.js";
import { where } from "sequelize";
import eAdmin from "../helpers/eAdmin.js";
import Usuarios from "../models/Usuarios.js";



const router = express.Router();

router.get('/', eAdmin.eAdmin, (req, res) => {
    res.render("admin/index")
})

router.get('/posts', eAdmin.eAdmin, (req, res) => {
    res.send('bonde do maluco')
})

router.get('/categorias', eAdmin.eAdmin, (req, res) => {
    categorias.findAll().then((categoria) => {
        res.render("admin/categorias", { categoria: categoria })
    }).catch(() => { req.flash("houve um erro ao lista as categorias") })

})

//add categorias
router.get('/categorias/add', eAdmin.eAdmin, (req, res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', eAdmin.eAdmin, (req, res) => {
    let erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome invalido" })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug invalido" })
    }

    if (req.body.nome.length <= 2) {
        erros.push({ texto: "nome da categoria muito pequeno" })
    }

    if (erros.length > 0) {
        res.render('admin/addcategorias', { erros: erros })
    } else {
        const novaCategoteria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new categorias(novaCategoteria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso")
            console.log('salvo com sucesso')
            res.redirect('/admin/categorias')
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro ao criar categoria")
            res.redirect('/admin')
        })
    }



})

router.post('/categorias/edit', eAdmin.eAdmin, (req, res) => {
    categorias.findOne({ where: { id: req.body.id } }).then((categoria) => {
        let erros = [];

        if (!req.body.nome || typeof req.body.nome === 'undefined' || req.body.nome === null) {
            erros.push({ texto: 'Nome não válido' });
        }

        if (!req.body.slug || typeof req.body.slug === 'undefined' || req.body.slug === null) {
            erros.push({ texto: 'Slug inválido' });
        }

        if (req.body.nome.length <= 2) {
            erros.push({ texto: 'Nome muito pequeno' });
        }

        if (erros.length === 0) {
            if (categoria) {
                categoria.nome = req.body.nome;
                categoria.slug = req.body.slug;

                categoria.save().then(() => {
                    req.flash('success_msg', 'Categoria editada com sucesso');
                    res.redirect('/admin/categorias');
                }).catch(() => {
                    req.flash('error_msg', 'Erro interno ao editar categoria');
                    res.redirect('/admin/categorias');
                });
            } else {
                req.flash('error_msg', 'Erro ao selecionar categoria');
                res.redirect('/admin/categorias');
            }
        } else {
            res.render('admin/editcategorias', { erros: erros, categoria: categoria });
        }
    }).catch(() => {
        req.flash('error_msg', 'Erro ao tentar editar a categoria');
        res.redirect('/admin/categorias');
    });
});

router.get('/categorias/edit/:id', eAdmin.eAdmin, (req, res) => {
    categorias.findOne({ where: { id: req.params.id } }).then((categoria) => {
        if (categoria) {
            res.render('admin/editcategorias', { categoria: categoria })
        } else {
            req.flash('error_msg', 'Categoria não encontrada');
            res.redirect('/admin/categorias');
        }
    }).catch((err) => {
        req.flash("erro_msg", "Outro erro")
        res.redirect('/admin/categorias')
    })

})

router.post('/categorias/deletar', eAdmin.eAdmin, (req, res) => {
    categorias.findOne({ where: { id: req.body.id } }).then((categoria) => {
        let nome = categoria.nome
        categorias.destroy({ where: { id: req.body.id } }).then((categoria) => {
            req.flash('success_msg', `Categoria ${nome} deletada com sucesso `)
            res.redirect('/admin/categorias')
        }).catch(() => {
            req.flash('error_msg', 'Houve um erro ao deletar categoria')
        })
    })

})

router.get('/postagens', eAdmin.eAdmin, (req, res) => {
    postagens.findAll({
        include: [
            {
                model: categorias,
                as: 'categorias'
            }
        ]
    }).then((postagem) => {
        res.render('admin/postagens', {
            postagem: postagem
        })
    }).catch((err) => {
        req.flash("error_msg", 'Erro ao listar postagens ' + err)
        res.redirect('/admin')
    })

})

router.get("/postagens/add", eAdmin.eAdmin, (req, res) => {
    categorias.findAll().then((categoria) => {
        res.render('admin/addpostagens', { categoria: categoria })
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao carregar formulario')
    })
})

router.post('/postagens/nova', eAdmin.eAdmin, (req, res) => {
    let erros = []

    if (req.body.categoriasId == 0 || req.body.categoriasId == null) {
        erros.push({ texto: 'Categoria invalida, registre uma categoria' })
    }
    if (!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
        erros.push({ texto: 'Titulo vazio' })
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: 'Slug vazio' })
    }
    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({ texto: 'Descrições vazias não são aceitas' })
    }
    if (!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null) {
        erros.push({ texto: 'Conteudo invalido' })
    }
    if (req.body.titulo.length <= 2) {
        erros.push({ texto: 'Titulo muito curto' })
    }

    if (erros.length > 0) {
        categorias.findAll().then((categoria) => {
            res.render('admin/addpostagens', {
                erros: erros,
                categoria: categoria
            })
        })

    } else {
        postagens.create({
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoriasId: req.body.categoriasId
        }).then(() => {
            req.flash('success_msg', "Postagem salva com successo")
            res.redirect('/admin/postagens')
        }).catch((err) => {

            req.flash("error_msg", 'houve um erro ao salvar a postagem' + err)
            res.redirect('/admin/postagens')
        })
    }

})

router.get('/postagens/edit/:id', eAdmin.eAdmin, (req, res) => {
    postagens.findOne({ where: { id: req.params.id } }).then((postagem) => {

        categorias.findAll().then((categoria) => {
            res.render('admin/editpostagens', {
                categoria: categoria,
                postagem: postagem
            })
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao listar categorias" + err)
            res.redirect('/admin/postagens')
        })

    }).catch((err) => {
        req.flash('error_msg', "Erro ao selecionar postagens" + err)
    })
})

router.post('/postagens/editar', eAdmin.eAdmin, (req, res) => {
    let erros = []

    if (req.body.categoriasId == 0 || req.body.categoriasId == null) {
        erros.push({ texto: 'Categoria invalida, registre uma categoria' })
    }
    if (!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
        erros.push({ texto: 'Titulo vazio' })
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: 'Slug vazio' })
    }
    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({ texto: 'Descrições vazias não são aceitas' })
    }
    if (!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null) {
        erros.push({ texto: 'Conteudo invalido' })
    }
    if (req.body.titulo.length <= 2) {
        erros.push({ texto: 'Titulo muito curto' })
    }

    if (erros.length > 0) {
        postagens.findOne().then((postagem) => {
            categorias.findAll().then((categoria) => {
                res.render('admin/editpostagens', {
                    postagem: postagem,
                    categoria: categoria,
                    erros: erros
                })
            }).catch((err) => {
                req.flash('error_msg', 'houve um erro ao encontrar categorias' + err)
            })
        }).catch((err) => {
            req.flash('error_msg', 'houve um erro ao encontrar postagem ' + err)

        })


    } else {
        postagens.findOne({ where: { id: req.body.id } }).then((postagem) => {
            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoriasId = req.body.categoriasId

            postagem.save().then(() => {
                req.flash('success_msg', "Postagem editada foi salva")
                res.redirect('/admin/postagens')
            }).catch((err) => {
                req.flash('error_msg', "Houve um erro ao salvar edição" + err)
                res.redirect('/admin/postagens')
            })

        }).catch((err) => {
            req.flash('error_msg', "houve um erro ao slvar a edição")
            res.redirect('/admin/postagens')
        })
    }

})

router.post('/postagens/deletar', eAdmin.eAdmin, (req, res) => {
    postagens.findOne({ where: { id: req.body.id } }).then((postagem) => {
        let nome = postagem.titulo
        postagens.destroy({ where: { id: req.body.id } }).then(() => {
            req.flash('success_msg', `Postagem ${nome} deletada com sucesso`)
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('error_msg', "Houve um ao deletar a postagem " + err)
            res.redirect('/admin/postagens')
        })
    }).catch((err) => {
        req.flash('error_msg', "houve um erro ao selecionar postagem " + err)
        res.redirect('/admin/postagens')
    })
})

router.get('/novoadm', eAdmin.eAdmin, (req, res) => {
    res.render('admin/novoadm')
})

router.post('/novoadm', eAdmin.eAdmin, (req, res) => {
    let email = req.body.email
    Usuarios.findOne({ where: { email: email } }).then((usuario) => {
        if (!usuario) {
            req.flash("error_msg", "Usuario não encontrado")
            res.redirect('/admin/novoadm')
        }

        if (usuario.eadmin !== 1) {
            usuario.eadmin = 1
            usuario.save().then(() => {
                req.flash("success_msg", `Usuario ${usuario.nome} agora é um administrador`)
                res.redirect('/')
            }).catch((err) => {
                req.flash('error_msg', 'Erro ao salvar ' + err)
            })


        } else {
            req.flash("error_msg", "Usuario já é um administrador")
            res.redirect('/admin/novoadm')
        }
    }).catch((err) => {
        req.flash("error_msg", "Deu erro" + err)       
    })

})

router.get('/removeadm',(req,res)=>{
    res.render('admin/removeadm')
})

router.post('/removeadm', (req,res)=>{    
    Usuarios.findOne({where:{email : req.body.email}}).then((usuario)=>{
        if(!usuario){
            req.flash('error_msg', 'Usuario não encontrado')
            res.redirect('/admin/removeadm')
        }

        if(usuario.email === 'jefersonrouue@gmail.com'){
            req.flash('error_msg', 'Esse Usuario não pode ser apagado Host maximo')
            res.redirect('/admin/removeadm')
        }else{
            if(usuario.eadmin !== 0){
                usuario.eadmin = 0
                usuario.save().then(() =>{
                    req.flash('success_msg', `Usuario ${usuario.nome} não é mais um administrador`)
                    res.redirect('/')
                }).catch((err) =>{
                    req.flash('error_msg', 'Erro ao salvar' + err)
                })
            }else{
                req.flash('error_msg', 'Esse usuario não e admin, logo não pode ser removido')
                res.redirect('/admin/removeadm')
            }
        }

       

    }).catch((err) =>{
        req.flash('error_msg', 'Houve erro' + err)
    })

})

export default router;

