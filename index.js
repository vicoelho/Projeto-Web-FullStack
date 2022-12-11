let http = require('http'),
    path = require('path'),
    express = require('express'),
    app = express(),
    Usuario = require("./model/Usuario")

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));

app.get('/index', (req, res) => {
    res.render('index');
});
app.get('/cadastro', (req, res) => {
    res.render('Cadastro');
});
app.post('/cadastro_post', async (req, res) => {
    let User = req.body.Usuario;
    let Password = req.body.Senha;
    let insert = await Usuario.insert(User, Password);
    switch (insert) {
        case 1:
            res.redirect('/index');
            break;
        case 10:
            res.render('Cadastro', {ErrorMsg: "Usuario já cadastrado", Usuario: User, Senha: Password});
            break;
        case 11:
            res.render('Cadastro', {ErrorMsg: "Usuário inválido, mínimo 3 caracteres", Usuario: User, Senha: Password});
            break;
        case 12:
            res.render('Cadastro', {ErrorMsg: "Senha inválida, mínimo 3 caracteres", Usuario: User, Senha: Password});
            break;
    }
});
app.post('/logar', async (req, res) => {
    let User = req.body.Usuario;
    let Senha = req.body.Senha;
    if (User.length < 3) {
        res.render('index', {ErrorMsg: 'Usuario inválido, minimo 3 caracteres', Usuario: User, Senha: Senha});
        return;
    }
    if (Senha.length < 3) {
        res.render('index', {ErrorMsg: 'Senha inválida, minimo 3 caracteres', Usuario: User, Senha: Senha});
        return;
    }

    let Cadastrado = await Usuario.find(User);
    if (Cadastrado.length < 1) {
        res.render('index', {ErrorMsg: 'Usuario não cadastrado', Usuario: User, Senha: Senha});
        return;
    }
    if (Cadastrado[0].Senha != Senha) {
        res.render('index', {ErrorMsg: 'Senha incorreta', Usuario: User, Senha: Senha});
        return;
    }
    console.log('logado com sucesso');
});

app.listen(3000);