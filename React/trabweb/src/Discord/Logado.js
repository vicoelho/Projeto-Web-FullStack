import React from 'react';
import './css/Logado.css'

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
    
    async Feed(){
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

        let Res = await fetch('http://localhost:8080/Feed', options)
        let Postagens = await Res.json()
        console.log('fedt '+Postagens.Postagem)
        this.setState({Feed: Postagens.Postagem});

        /*fetch('http://localhost:8080/Feed', options)
        .then(Res => Res.json())
        .then(Res => {
            this.setState({Feed: Res.Postagem});
            console.log('feed ' + this.state.Feed)
        });*/
    }
    
    ChangeFiltro(ev){
        this.setState({Filtro: ev.target.value});
    }

    async Filtrar(){
        await this.Feed();
        console.log(this.state.Feed)
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
        console.log('Novo filt '+NewFeed)
        console.log('Novo feed '+this.state.Feed)
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