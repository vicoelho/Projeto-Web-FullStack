const MongoURL = "mongodb+srv://user:123@projetoweb.ezrc5ni.mongodb.net/?retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient;

module.exports = class Postagens {
    static async insertTexto(Usuario, Post){
        const conn = await MongoClient.connect(MongoURL);
        const db = conn.db().collection('Postagens');
        if (Post.length < 3) {
            conn.close()
            return 0;
        }
        await db.insertOne({
            User: Usuario,
            Content: Post,
            Type: "Text"
        });
        conn.close();
        return 1;
    };

    static async findTexto() {
        const conn = await MongoClient.connect(MongoURL);
        const db = conn.db().collection('Postagens');
        let result = await db.find().toArray();
        conn.close();
        return result;
    }
}