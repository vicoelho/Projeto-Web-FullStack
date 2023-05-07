import React from 'react';
import './css/Logado.css'

export default class Logado extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            msg: '',
            User: '',
            Password: ''
        };
        this.logado()
    }

    logado(){
        console.log('valida logado');
        const options = {
            method: 'GET'
        };
        fetch('http://localhost:8080/logado', options)
            .then(Res => Res.json())
                .then(Res => {
                    if (!Res.Logado) {
                        window.location.href = "./";
                    }
                });
    }

    logout(){
        console.log('logausdd')
        const options = {
            method: 'GET'
        };
        fetch('http://localhost:8080/logout', options)
            .then(Res => Res.json())
                .then(Res => {
                    if (Res.Logout) {
                        window.location.href = "./";
                    }
                });
    }
    
    render(){
        return(
            <div onLoad={this.logado.bind(this)}>
                <p class="nomeUser"></p><br /><br />
                <div class="divGeral">
                    <div class="divAddTexto"><br /><label class="lb_addTexto">Adicionar Texto:</label>Adicionar<br />
                        <input type="text" name="Texto" class="inputDivTexto" id="InpTexto" />
                        <button class="btn_post" id="PostarTexto">Postar</button>
                        <p class="ErrorTexto"></p>
                    </div>
                    <div action="/PostarImagens" method="POST" enctype="multipart/form-data" class="divAddFoto"><label class="lb_addFoto">Adicionar Foto:</label><br />
                        <input name="imagem" type="file" id="InpImagem" />
                        <button class="btn_post" id="PostarImagem">Postar</button>
                        <p class="ErrorImagem"></p>
                    </div>
                    <form action="/PostarVideos" method="POST" enctype="multipart/form-data" class="divAddVideo"><label class="lb_addVideo">Adicionar Vídeo:</label><br />
                        <input name="video" type="file" />
                        <input type="submit" value="Postar" class="btn_post" />
                        <p></p>
                    </form>
                </div>
                <div class="div_radio">
                    <div>
                        <label class="filtro_user">Postagens do usuário:</label>
                        <input name="PostUser" type="text" class="input_user" /><br />

                        <input type="radio" id="todos" name="PostType" value="*" checked />
                        <label for="todos">Todas</label><br />
                        <input type="radio" id="texto" name="PostType" value="Text" />
                        <label for="texto">Texto</label><br />
                        <input type="radio" id="imagem" name="PostType" value="Img" />
                        <label for="imagem">Imagem</label><br />
                        <input type="radio" id="video" name="PostType" value="Vid" />
                        <label for="video">Video</label><br />

                        <button class="btn_post" id="BtnFiltrar">Filtrar</button>
                    </div>
                </div>

                <button class="btn_desconectar" onClick={this.logout.bind(this)}>Desconectar</button>

                <div id="Feed">
                </div>
            </div>
        );
    }
}