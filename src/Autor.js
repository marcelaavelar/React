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
    this.setNome = this.setNome.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);
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
      },
      error: function(resposta) {
        if(resposta.status === 400) {
          new TracerErrors().publicaErros(resposta.responseJSON);
        }
      }
    });
  }
  
  setNome(evento) {
  this.setState({nome:evento.target.value});
  }

  setEmail(evento) {
  this.setState({email:evento.target.value});
  }

  setSenha(evento) {
  this.setState({senha:evento.target.value});
  }

  render() {
    return (
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
          <InputCustomized id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome" />                  
          <InputCustomized id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email" />
          <InputCustomized id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha" />
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
        <FormularioAutor/>
        <TabelaAutores lista={this.state.lista}/>
      </div>
    );
  }
}