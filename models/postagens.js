import sequelize from "./Bd.js";
import { DataTypes, DATE } from "sequelize";
import categorias from "./categorias.js";

const postagens = sequelize.define('postagens', {
    titulo : {
       type : DataTypes.STRING,
       allowNull : true
    },

    slug : {
        type : DataTypes.STRING,
        allowNull : true
    },
    descricao : {
        type : DataTypes.STRING,
        allowNull : true

    },

    conteudo : {
        type : DataTypes.TEXT,
        allowNull : true
    },
    categoriasId : {
        type: DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'categorias',
            key : 'id'
        }
    },
    data : {
        type : DataTypes.DATE,
        defaultValue : DataTypes.NOW
    }
})
//postagens.sync()

postagens.belongsTo(categorias,{foreignKey: 'categoriasId', as: 'categorias'});
categorias.hasMany(postagens, {foreignKey: 'categoriasId', as: 'postagens'});
export default postagens;
