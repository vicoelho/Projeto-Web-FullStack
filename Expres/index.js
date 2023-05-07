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

app.get('/', (req, res) => {
    res.redirect('/index');
});
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/index.html'));
});
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/Cadastro.html'));
});
app.post('/cadastro_post', async (req, res) => {
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
app.post('/logar', async (req, res) => {
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
    console.log(req.session)
    req.session.save();
    res.send({Logado: true, msg: ''});
});

app.get('/logado', async (req, res) => {
    console.log(req.session)
    if (!(req.session && req.session.token)) {
        res.send({Logado: false});
        return;
    }
    
    let Cadastrado = await Usuario.find(req.session.token, "User");
    if (!Cadastrado.length === 0) {
        req.session.destroy();
        res.send({Logado: false});
        return;
    }
    res.send({Logado: true});
});
app.post('/Feed', async (req, res) => {
    let Postagens = await Postagem.Feed(req.body.Usuario, req.body.Tipo);
    res.send({Postagem: Postagens});
});
app.get('/UserLogado', (req, res) => {
    res.send({Nome: req.session.token});
});
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send({Logout: true});
});

app.post('/PostarTexto', async (req, res) => {
    let User = await Usuario.find(req.session.token, "User");
    let Post = req.body.Texto;
    if (User.length === 0) {
        res.sendFile(path.join(__dirname, 'view/index.html'));
        return;
    }
    let Postado = await Postagem.insertTexto(User[0].User, Post);
    if (Postado === 0) {
        res.send({Post: false, msg: "O texto deve possuir um minimo de 3 caracteres"});
        return;
    };
    let PostNum = await Usuario.find(req.session.token, "User");
    if (!PostNum.length === 0) {
        req.session.destroy();
        res.sendFile(path.join(__dirname, 'view/index.html'));
        return;
    }
    req.session.numpostagens = PostNum[0].Postagens;
    req.session.save();
    res.send({Post: true, msg: "Postado com sucesso"});
});
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'Uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, req.session.token + req.session.numpostagens + path.extname(file.originalname));
    }
})
const upload = multer({storage})
app.post('/PostarImagens', upload.single("imagem"), async (req, res) => {
    console.log(req.body + "-" + req.imagem);
    let Req = JSON.stringify(req.body);
    console.log(Req);
    //const Formato = ['image/jpeg', 'image/png', 'image/gif'].includes(req.body.File.type);
    //console.log(Formato)
/*    if (!Formato) {
        let Postagens = await Postagem.Feed();
        res.send({Post: false, msg: "Formato de imagem inválido"});
        return;
    };
    await Postagem.insertImagem(req.session.token, req.file.filename);
    let PostNum = await Usuario.find(req.session.token, "User");
    if (!PostNum.length === 0) {
        req.session.destroy();
        res.sendFile(path.join(__dirname, 'view/index.html'));
        return;
    }
    req.session.numpostagens = PostNum[0].Postagens;
    req.session.save();
    res.send({Post: true, msg: "Postado com sucesso"});
*/
});
app.post('/PostarVideos', upload.single("video"), async (req, res) => {
    if (req.file.mimetype != "video/mp4") {
        res.render('logado', {ErroVideo: "Formato de video inválido", Postagem: Postagens});
        return;
    };
    await Postagem.insertVideo(req.session.token, req.file.filename);
    let PostNum = await Usuario.find(req.session.token, "User");
    if (!PostNum.length === 0) {
        req.session.destroy();
        res.redirect('/index');
        return;
    }
    req.session.numpostagens = PostNum[0].Postagens;
    req.session.save();
    res.redirect('logado');
});

app.listen(8080);