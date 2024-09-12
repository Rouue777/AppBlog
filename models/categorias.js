import { DataTypes } from "sequelize";
import sequelize from "./Bd.js";

const categorias = sequelize.define('categorias', {
    nome : {
        type : DataTypes.STRING,
        allowNull : false
    },
    slug : {
        type : DataTypes.STRING,
        allowNull : true
    },
    date : {
        type : DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
})
export default categorias;

