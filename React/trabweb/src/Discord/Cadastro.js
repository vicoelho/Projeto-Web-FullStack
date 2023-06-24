import React from 'react';
import './css/Cadastro.css'

export default class Cadastro extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            msg: '',
            User: '',
            Email: '',
            Password: ''
        };
    }

    cadastrar(){
        let Corpo = {
            'Usuario': this.state.User,
            'Email': this.state.Email,
            'Senha': this.state.Password
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Corpo)
        };
        console.log(JSON.stringify(Corpo));
        fetch('http://localhost:8080/usuario', options)
            .then(Res => Res.json())
                .then(Res => {
                    if (Res.Cadastrado) {
                        window.location.href = "./";
                    } else {
                        this.setState({
                            msg: Res.msg
                        });
                    }
                });
        
    }

    ChangeUser(ev){
        this.setState({User: ev.target.value});
    }
    ChangeEmail(ev){
        this.setState({Email: ev.target.value});
    }
    ChangePassword(ev){
        this.setState({Password: ev.target.value});
    }

    render(){
        return(
            <div class="Registro">
                <div class="Fundo">
                    <label class="LabelTitulo"><b>Criar uma conta</b></label>
                    <div class="Formulario">
                        <label class="LabelCad"><b>USUARIO</b></label>
                        <input type="text" class="InputText" id="CadUser" value={this.state.User} onChange={this.ChangeUser.bind(this)}/>
                        <label class="LabelCad"><b>E-MAIL</b></label>
                        <input type="text" class="InputText" id="CadEmail" value={this.state.Email} onChange={this.ChangeEmail.bind(this)}/>
                        <label class="LabelCad"><b>SENHA</b></label>
                        <input type="password" class="InputText" id="CadSenha" value={this.state.Password} onChange={this.ChangePassword.bind(this)}/>
                        <button class="InputSubmit" onClick={this.cadastrar.bind(this)}>Cadastrar</button>
                        <label class="LabelCad" id="CadError">{this.state.msg}</label>
                    </div>
                </div>
            </div>
        );
    }
}