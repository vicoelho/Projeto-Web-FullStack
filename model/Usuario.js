const MongoURL = "mongodb+srv://user:123@projetoweb.ezrc5ni.mongodb.net/?retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient;
const validator = require('validator');

module.exports = class Usuario {
    static async insert(usuario, email, senha) {
        if (usuario.length < 3) {
            return 12;
        };
        if (email.length < 3 || !validator.isEmail(email)) {
            return 13;
        }
        if (senha.length < 3) {
            return 14;
        };

        const conn = await MongoClient.connect(MongoURL);
        const db = conn.db().collection('Usuarios');
        let jaCadastrado = await this.find(usuario, "User");
        if (jaCadastrado.length > 0) {
            conn.close();
            return 10;
        }
        jaCadastrado = await this.find(email, "Email");
        if (jaCadastrado.length > 0) {
            conn.close();
            return 11;
        }
        await db.insertOne({
            User: usuario,
            Email: email,
            Senha: senha
        });
        conn.close();
        return 1;
    };

    static async find(Usuario, Field) {
        const conn = await MongoClient.connect(MongoURL);
        const db = conn.db().collection('Usuarios');
        let result;
        if (Field === "User") {
            result = await db.find({User: Usuario}).toArray();
        } else if (Field === "Email") {
            result = await db.find({Email: Usuario}).toArray();
        }
        conn.close();
        return result;
    };
}