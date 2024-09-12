export default {
    eAdmin : function(req,res,next){
        
        if(req.isAuthenticated() && req.user.eadmin == 1){
            return next()
        }
        

        req.flash("error_msg", "Você precisa ser um Administrador")
        res.redirect("/")
    }

};