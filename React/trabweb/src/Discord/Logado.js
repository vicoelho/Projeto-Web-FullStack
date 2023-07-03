import React from 'react';
import './css/Logado.css';

export default class Logado extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            UserName: '',
            Texto: '',
            msg: '',
            Feed: [],
            Filtro: ''
        };
        const socket = null;
        this.logado()
        this.connsocket()
    }

    async logado(){
        if (!localStorage.getItem('Token')) {
            return false
        }
        let url = 'http://localhost:8080/usuario/' + localStorage.getItem('Token')
        const options = {
            method: 'GET'
        };
        fetch(url, options)
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
        this.socket.close();
        window.location.href = "./";
    }

    PostarTexto(){
        if (!localStorage.getItem('Token')) {
            return false
        }
        let url = 'http://localhost:8080/usuario/' + localStorage.getItem('Token')
        let options = {
            method: 'GET'
        };
        fetch(url, options)
            .then(Res => Res.json())
                .then(Res => {
                    if (!(Res.Logado)) {
                        this.logout();
                    }
                });
        
        let Corpo = {
            'token': localStorage.getItem('Token'),
            'Texto': this.state.Texto
        };
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Corpo)
        };
        fetch('http://localhost:8080/postagem', options)
            .then(Res => Res.json())
                .then(Res => {
                    if (!Res.Logado) {
                        this.logout();
                    };
                    if (Res.Post) {
                        this.setState({Texto: ''});
                        this.sendsocket()
                        this.Feed();
                    }
                    this.setState({msg: Res.msg});
                });
    }
    ChangeTexto(ev){
        this.setState({Texto: ev.target.value});
    }
    
    async Feed(){
        const options = {
            method: 'GET'
        };

        let Res = await fetch('http://localhost:8080/postagem', options)
        let Postagens = await Res.json()
        let Textos = [];
        Postagens.map(Post => {
            Textos.push(Post);
        });
        this.setState({Feed: Textos});
    }
    
    ChangeFiltro(ev){
        this.setState({Filtro: ev.target.value});
    }

    async Filtrar(){
        await this.Feed();
        if (!this.state.Filtro) {
            return;
        }
        let NewFeed = []
        let Tam = this.state.Filtro.length;
        this.state.Feed.map((i, key) => {
            if (i.Texto.length >= Tam) {
                let ini = 0;
                let fin = Tam;
                while (fin <= i.Texto.length) {
                    if (i.Texto.substring(ini, fin) === this.state.Filtro) {
                        NewFeed.push(i);
                        break;
                    }
                    ini++;
                    fin++;
                }
            }
        });
        this.setState({Feed: NewFeed});
    }

    connsocket() {
        this.socket = new WebSocket("ws://localhost:8000");
        this.socket.addEventListener('message', (msg) => this.Feed())
    }
    sendsocket(){
        this.socket.send('publicacao');
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

                <div class="DivFiltro">
                    <label class="lb_Filtro">Filtrar:</label>
                    <input type="text" class="inputFiltro" id="InpFiltro" value={this.state.Filtro} onChange={this.ChangeFiltro.bind(this)}/> <br />
                    <button class="btn_filtro" id="Filtrar" onClick={this.Filtrar.bind(this)}>Postar</button>
                </div>

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