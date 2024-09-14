//conexão do banco de dados
import { Sequelize } from 'sequelize';

//sequelize
const sequelize = new Sequelize('blogapp', 'root', 'EzsBYoOrLuccbzkToNIkdzbFlYNigZyR', {
    host: 'junction.proxy.rlwy.net',
    port : 55947,
    dialect: 'mysql'
})
export default sequelize;

sequelize.authenticate().then(function (erro) { console.log('Conectado a Database com sucesso') })
.catch(function (erro) { console.log(`Erro ao conectar ao console ${erro}`) })

