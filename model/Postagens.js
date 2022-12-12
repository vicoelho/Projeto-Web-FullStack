const MongoURL = "mongodb+srv://user:123@projetoweb.ezrc5ni.mongodb.net/?retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient;

module.exports = class Postagens {
    static async insertTexto(Usuario, Post){
        const conn = await MongoClient.connect(MongoURL);
        const db = conn.db().collection('Postagens');
        let now = new Date;
        let DateTime = now.getFullYear().toString()+("00"+now.getMonth()).slice(-2)+("00"+now.getDate()).slice(-2)+("00"+now.getHours()).slice(-2)+("00"+now.getMinutes()).slice(-2)+("00"+now.getSeconds()).slice(-2);
        if (Post.length < 3) {
            conn.close()
            return 0;
        }
        await db.insertOne({
            User: Usuario,
            Content: Post,
            Type: "Text",
            DateTime: DateTime
        });
        conn.close();
        return 1;
    };

    static async findTexto() {
        const conn = await MongoClient.connect(MongoURL);
        const db = conn.db().collection('Postagens');
        let sort = {DateTime: -1};
        let result = await db.find().sort(sort).toArray();
        conn.close();
        return result;
    }
}