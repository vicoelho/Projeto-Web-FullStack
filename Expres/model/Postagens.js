const MongoURL = "mongodb+srv://user:123@projetoweb.ezrc5ni.mongodb.net/?retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient;
const BDUsuario = require('./Usuario.js');

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
            Texto: Post,
            Type: "Text",
            DateTime: DateTime
        });
        await BDUsuario.attPost(Usuario);
        conn.close();
        return 1;
    };
    static async Feed() {
        const conn = await MongoClient.connect(MongoURL);
        const db = conn.db().collection('Postagens');
        let sort = {DateTime: -1};
        let result = await db.find().sort(sort).toArray();
        conn.close();
        return result;
    };

/*
    static async Feed(PostUser, PostType) {
        const conn = await MongoClient.connect(MongoURL);
        const db = conn.db().collection('Postagens');
        let find = {};
        if ((PostUser != null && PostUser != '') && (PostType != null && PostType != '*')) {
            find =  {
                User: PostUser,
                Type: PostType
            };
        } else if (PostUser != null && PostUser != '') {
            find = {
                User: PostUser
            };
        } else if (PostType != null && PostType != '*') {
            find =  {
                Type: PostType
            };
        };
        let sort = {DateTime: -1};
        let result = await db.find(find).sort(sort).toArray();
        conn.close();
        return result;
    };
*/

    static async insertImagem(Usuario, PathIgm) {
        const conn = await MongoClient.connect(MongoURL);
        const db = conn.db().collection('Postagens');
        let now = new Date;
        let DateTime = now.getFullYear().toString()+("00"+now.getMonth()).slice(-2)+("00"+now.getDate()).slice(-2)+("00"+now.getHours()).slice(-2)+("00"+now.getMinutes()).slice(-2)+("00"+now.getSeconds()).slice(-2);
        await db.insertOne({
            User: Usuario,
            PathImg: PathIgm,
            Type: "Img",
            DateTime: DateTime
        });
        await BDUsuario.attPost(Usuario);
        conn.close();
        return 1;
    };
    
    static async insertVideo(Usuario, PathVid) {
        const conn = await MongoClient.connect(MongoURL);
        const db = conn.db().collection('Postagens');
        let now = new Date;
        let DateTime = now.getFullYear().toString()+("00"+now.getMonth()).slice(-2)+("00"+now.getDate()).slice(-2)+("00"+now.getHours()).slice(-2)+("00"+now.getMinutes()).slice(-2)+("00"+now.getSeconds()).slice(-2);
        await db.insertOne({
            User: Usuario,
            PathVid: PathVid,
            Type: "Vid",
            DateTime: DateTime
        });
        await BDUsuario.attPost(Usuario);
        conn.close();
        return 1;
    };
}