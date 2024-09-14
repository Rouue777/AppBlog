import sequelize from "./Bd.js";
import { DataTypes } from "sequelize";

const Usuarios =  sequelize.define('usuarios', {
    nome : {
        type : DataTypes.STRING,
        allowNull: false
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false
    },
    eadmin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0 
    },
    senha : {
        type : DataTypes.STRING,
        allowNull: false
    }
})

export default Usuarios;