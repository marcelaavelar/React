import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomized from './componentes/InputCustomized';
import ButtonSubmitCustomized from './componentes/ButtonSubmitCustomized';
import PubSub from 'pubsub-js';
import TracerErrors from './TracerErrors';

class FormularioAutor extends Component {

  constructor() {

    super();
    this.state = {nome:'', email:'', senha:''};
    this.enviaForm = this.enviaForm.bind(this);
  }

  enviaForm(evento) {

    evento.preventDefault();

    $.ajax({

      url:"http://cdc-react.herokuapp.com/api/autores",
      contentType:'application/json',
      dataType:'json',
      type:'post',
      data:JSON.stringify({nome:this.state.nome, email:this.state.email, senha:this.state.senha}),
      success: function(novaListagem) {
        PubSub.publish('atualiza-lista-autores',novaListagem);
        this.setState({nome:'', email:'', senha:''});
      }.bind(this),
      error: function(resposta) {
        if(resposta.status === 400) {
          new TracerErrors().publicaErros(resposta.responseJSON);
        }
      },
      beforeSend: function() {
        PubSub.publish("limpa-erros", {});
      }
    });
  }
  
  salvaAlteracao(nomeInput, evento) {
    var campoSendoAlterado = {};
    campoSendoAlterado[nomeInput] = evento.target.value;
    this.setState(campoSendoAlterado);
  }

  render() {
    return (
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
          <InputCustomized id="nome" type="text" name="nome" value={this.state.nome} onChange={this.salvaAlteracao.bind(this,'nome')} label="Nome" />                  
          <InputCustomized id="email" type="email" name="email" value={this.state.email} onChange={this.salvaAlteracao.bind(this,'email')} label="Email" />
          <InputCustomized id="senha" type="password" name="senha" value={this.state.senha} onChange={this.salvaAlteracao.bind(this,'senha')} label="Senha" />
          <ButtonSubmitCustomized label="Gravar" />
        </form>
      </div>
    );
  }
}

class TabelaAutores extends Component {

  render() {
    return(
      <div>            
        <table className="pure-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.lista.map(function(autor) {
                return (
                  <tr key={autor.id}>
                    <td>{autor.nome}</td>
                    <td>{autor.email}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table> 
      </div>          
    );
  }
}

export default class AutorBox extends Component {

  constructor() {
    super();
    this.state = {lista : []};
  }

  componentDidMount(){

    $.ajax({
      url:"http://cdc-react.herokuapp.com/api/autores",
      dataType:'json',
      success:function(resposta) {
      this.setState({lista:resposta});
      }.bind(this)
    }
    );

    PubSub.subscribe('atualiza-lista-autores', function(topico, novaListagem) {
      this.setState({lista:novaListagem});
    }.bind(this));
  }

  render() {
    return (
      <div>
        <div className="header">
        <h1>Cadastro de Autores</h1>
        </div>
        <div className="content" id="content">
          <FormularioAutor/>
          <TabelaAutores lista={this.state.lista}/>
        </div>
      </div>
    );
  }
}