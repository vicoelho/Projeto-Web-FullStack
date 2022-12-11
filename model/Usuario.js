const MongoURL = "mongodb+srv://user:123@projetoweb.ezrc5ni.mongodb.net/?retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient;

module.exports = class Usuario {
    static async insert(usuario, senha) {
        if (usuario.length < 3) {
            return 11;
        };
        if (senha.length < 3) {
            return 12;
        };

        const conn = await MongoClient.connect(MongoURL);
        const db = conn.db().collection('Usuarios');
        let jaCadastrado = await this.find(usuario);
        if (jaCadastrado.length > 0) {
            conn.close;
            return 10;
        }
        db.insertOne({
            User: usuario,
            Senha: senha
        });
        return 1;
    };

    static async find(Usuario) {
        const conn = await MongoClient.connect(MongoURL);
        const db = conn.db().collection('Usuarios');
        let result = await db.find({User: Usuario}).toArray();
        conn.close();
        return result;
    };
}