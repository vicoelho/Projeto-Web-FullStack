let http = require('http'),
    path = require('path'),
    express = require('express'),
    app = express(),
    Usuario = require("./model/Usuario"),
    Postagem = require("./model/Postagens"),
    session = require('express-session'),
    multer = require('multer'),
    cors = require('cors');

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'view'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Uploads')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
    secret: 'segredo',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));
app.use(cors());

app.post('/usuario', async (req, res) => {
    let User = req.body.Usuario;
    let Email = req.body.Email;
    let Password = req.body.Senha;
    let insert = await Usuario.insert(User, Email, Password);
    switch (insert) {
        case 1:
            res.send({Cadastrado: true, msg: "Usuario cadastrado com sucesso"});
            break;
        case 10:
            res.send({Cadastrado: false, msg: "Usuario já cadastrado"});
            break;
            case 11:
                res.send({Cadastrado: false, msg: "Email já cadastrado"});
                break;
            case 12:
                res.send({Cadastrado: false, msg: "Usuário inválido, mínimo 3 caracteres"});
                break;
            case 13:
                res.send({Cadastrado: false, msg: "Email inválido"});
                break;
            case 14:
                res.send({Cadastrado: false, msg: "Senha inválida, mínimo 3 caracteres"});
            break;
    };
});
app.post('/login', async (req, res) => {
    let User = req.body.Usuario;
    let Senha = req.body.Senha;
    if (User.length < 3) {
        res.send({Logado: false, msg: "Usuário inválido, mínimo 3 caracteres"});
        return;
    }
    if (Senha.length < 3) {
        res.send({Logado: false, msg: 'Senha inválida, minimo 3 caracteres'});
        return;
    }
    
    let Cadastrado = await Usuario.find(User, "User");
    if (Cadastrado.length === 0) {
        res.send({Logado: false, msg: 'Usuario não cadastrado'});
        return;
    }
    if (Cadastrado[0].Senha != Senha) {
        res.send({Logado: false, msg: 'Senha incorreta'});
        return;
    }
    req.session.token = Cadastrado[0].User;
    req.session.numpostagens = Cadastrado[0].Postagens;
    req.session.save();
    res.send({Logado: true, msg: '', User: Cadastrado[0].User, Postagens: Cadastrado[0].Postagens});
});

app.get('/usuario/:id', async (req, res) => {
/*    if (!(req.session && req.session.token)) {
        res.send({Logado: false});
        return;
    }
*/
    console.log(req.params.id)
    let Cadastrado = await Usuario.find(req.params.id, "User");
    if (!Cadastrado.length === 0) {
        req.session.destroy();
        res.send({Logado: false});
        return;
    }
    res.send({Logado: true});
});
app.get('/postagem', async (req, res) => {
    let Postagens = await Postagem.Feed(req.body.Usuario, req.body.Tipo);
    res.send({Postagem: Postagens});
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send({Logout: true});
});

app.post('/postagem', async (req, res) => {
    let User = await Usuario.find(req.body.token, "User");
    let Post = req.body.Texto;
    if (User.length === 0) {
        res.send({Logado: false, Post: false, msg: "", Postagens: 0});
        return;
    }
    let Postado = await Postagem.insertTexto(User[0].User, Post);
    if (Postado === 0) {
        res.send({Logado: true, Post: false, msg: "O texto deve possuir um minimo de 3 caracteres", Postagens: 0});
        return;
    };
    let PostNum = await Usuario.find(req.body.token, "User");
    if (!PostNum.length === 0) {
        res.send({Logado: false, Post: false, msg: "", Postagens: 0});
        return;
    }
    req.session.numpostagens = PostNum[0].Postagens;
    req.session.save();
    res.send({Logado:true, Post: true, msg: "Postado com sucesso", Postagens: PostNum[0].Postagens});
});

app.listen(8080);