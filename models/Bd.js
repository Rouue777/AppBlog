//conexão do banco de dados
import { Sequelize } from 'sequelize';

//sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port : process.env.DB_PORT,
    dialect: 'mysql'
})
export default sequelize;

sequelize.authenticate().then(function (erro) { console.log('Conectado a Database com sucesso') })
.catch(function (erro) { console.log(`Erro ao conectar ao console ${erro}`) })

