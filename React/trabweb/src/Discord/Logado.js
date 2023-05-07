import React from 'react';
import './css/Logado.css'

export default class Logado extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            UserName: '',
            Texto: '',
            msg: '',
            Feed: []
        };
        this.logado()
    }

    logado(){
        if (!localStorage.getItem('Token')) {
            window.location.href = "./";
        }
        let Corpo = {
            'Usuario': localStorage.getItem('Token')
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Corpo)
        };
        fetch('http://localhost:8080/logado', options)
            .then(Res => Res.json())
                .then(Res => {
                    if (Res.Logado) {
                        this.setState({UserName: localStorage.getItem('Token')});
                        this.Feed();
                    } else {
                        this.logout();
                    }
                });
    }

    logout(){
        localStorage.removeItem('Token');
        localStorage.removeItem('Postagens');
        window.location.href = "./";
    }

    PostarTexto(){
        if (!localStorage.getItem('Token')) {
            window.location.href = "./";
        }
        let Corpo = {
            'token': localStorage.getItem('Token'),
            'Texto': this.state.Texto
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Corpo)
        };
        fetch('http://localhost:8080/PostarTexto', options)
            .then(Res => Res.json())
                .then(Res => {
                    if (!Res.Logado) {
                        this.logout();
                    };
                    if (Res.Post) {
                        this.setState({Texto: ''});
                        this.Feed();
                    }
                    this.setState({msg: Res.msg});
                });
    }
    ChangeTexto(ev){
        this.setState({Texto: ev.target.value});
    }
    
    Feed(){
        let Corpo = {
            'token': localStorage.getItem('Token'),
            'Texto': this.state.Texto
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Corpo)
        };
        fetch('http://localhost:8080/Feed', options)
            .then(Res => Res.json())
                .then(Res => {
                    this.setState({Feed: Res.Postagem});
                });
    }

    render(){
        return(
            <div onLoad={this.logado.bind(this)} class="DivTela">
                <p class="nomeUser">Usuário: {this.state.UserName}</p>
                <div class="divAddTexto">
                    <label class="lb_addTexto">Adicionar Texto:</label>
                    <input type="text" class="inputDivTexto" id="InpTexto" value={this.state.Texto} onChange={this.ChangeTexto.bind(this)}/> <br />
                    <button class="btn_post" id="PostarTexto" onClick={this.PostarTexto.bind(this)}>Postar</button>
                    <p class="ErrorTexto">{this.state.msg}</p>
                </div>

                <button class="btn_desconectar" onClick={this.logout.bind(this)}>Desconectar</button>

                <div id="Feed">
                    <ul>
                        {this.state.Feed.map((i, key) =>
                            <li key={key}>
                                <p>Postagem realizada por: {i.User}</p>
                                <p>{i.Texto}</p>
                            </li>)}
                    </ul>
                </div>
            </div>
        );
    }
}