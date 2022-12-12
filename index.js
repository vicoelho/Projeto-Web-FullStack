let http = require('http'),
    path = require('path'),
    express = require('express'),
    app = express(),
    Usuario = require("./model/Usuario"),
    Postagem = require("./model/Postagens"),
    session = require('express-session');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'segredo',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

app.get('/', (req, res) => {
    res.redirect('/index');
});
app.get('/index', (req, res) => {
    if (req.session && req.session.token) {
        res.redirect('/logado');
        return;
    }
    res.render('index');
});
app.get('/cadastro', (req, res) => {
    res.render('Cadastro');
});
app.post('/cadastro_post', async (req, res) => {
    let User = req.body.Usuario;
    let Email = req.body.Email;
    let Password = req.body.Senha;
    let insert = await Usuario.insert(User, Email, Password);
    switch (insert) {
        case 1:
            res.redirect('/index');
            break;
        case 10:
            res.render('Cadastro', {ErrorMsg: "Usuario já cadastrado", Usuario: User, Email: Email, Senha: Password});
            break;
        case 11:
            res.render('Cadastro', {ErrorMsg: "Email já cadastrado", Usuario: User, Email: Email, Senha: Password});
            break;
        case 12:
            res.render('Cadastro', {ErrorMsg: "Usuário inválido, mínimo 3 caracteres", Usuario: User, Email: Email, Senha: Password});
            break;
        case 13:
            res.render('Cadastro', {ErrorMsg: "Email inválido", Usuario: User, Email: Email, Senha: Password});
            break;
        case 14:
            res.render('Cadastro', {ErrorMsg: "Senha inválida, mínimo 3 caracteres", Usuario: User, Email: Email, Senha: Password});
            break;
    };
});
app.post('/logar', async (req, res) => {
    let User = req.body.Usuario;
    let Senha = req.body.Senha;
    if (User.length < 3) {
        res.render('index', {ErrorMsg: 'Usuario inválido, minimo 3 caracteres', Usuario: User, Senha: Senha});
        res.end();
        return;
    }
    if (Senha.length < 3) {
        res.render('index', {ErrorMsg: 'Senha inválida, minimo 3 caracteres', Usuario: User, Senha: Senha});
        return;
    }

    let Cadastrado = await Usuario.find(User, "User");
    if (!Cadastrado.length === 0) {
        res.render('index', {ErrorMsg: 'Usuario não cadastrado', Usuario: User, Senha: Senha});
        return;
    }
    if (Cadastrado[0].Senha != Senha) {
        res.render('index', {ErrorMsg: 'Senha incorreta', Usuario: User, Senha: Senha});
        return;
    }
    req.session.token = Cadastrado[0].User;
    req.session.save();
    res.redirect('/logado');
});
app.get('/logado', async (req, res) => {
    if (!(req.session && req.session.token)) {
        res.redirect('/index');
        return;
    }
    
    let Cadastrado = await Usuario.find(req.session.token, "User");
    if (!Cadastrado.length === 0) {
        req.session.destroy();
        res.redirect('/index');
        return;
    }
    let Postagens = await Postagem.findTexto();
    res.render('logado', {Usuario: Cadastrado[0].User, Postagem: Postagens});
});
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/index');
});
app.post('/PostarTexto', async (req, res) => {
    let User = await Usuario.find(req.session.token, "User");
    let Post = req.body.Texto;
    if (User.length === 0) {
        res.render('index', {ErrorMsg: 'Usuario não logado', Usuario: '', Senha: '  '});
        return;
    }
    let Postado = await Postagem.insertTexto(User[0].User, Post);
    if (Postado === 0) {
        let Postagens = await Postagem.findTexto();
        res.render('logado', {ErroTexto: "O texto deve possuir um minimo de 3 caracteres", Postagem: Postagens});
        return;
    };

    res.redirect('logado');
});

app.listen(3000);