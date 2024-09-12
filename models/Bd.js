//conexão do banco de dados
import { Sequelize } from 'sequelize';

//sequelize
const sequelize = new Sequelize('Blogapp', 'root', 'sql123', {
    host: 'localhost',
    dialect: 'mysql'
})
export default sequelize;

sequelize.authenticate().then(function (erro) { console.log('Conectado a Database com sucesso') })
.catch(function (erro) { console.log(`Erro ao conectar ao console ${erro}`) })

