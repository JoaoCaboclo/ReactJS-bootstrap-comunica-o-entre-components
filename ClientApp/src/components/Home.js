import React, { Component } from 'react'
import Child from './parentToChild/child'
import ManutencaoCadAtleta from './ManutencaoCadAtleta/ManutencaoCadAtleta'
import ShowListaAtletas from './ListaAtletas/ShowListaAtletas'

export class Home extends Component {
  static displayName = Home.name;

    changeTheWorld = (newTitle) => {
        this.setState({ title: newTitle });
    }

    state = {
        title: 'Placeholder for tttle',
        atletas: [],
        numeroAtletas: 0,
        nomeAtletaDigitado: ''
    }

    AddAtleta = (atleta) => {
        const atletasCopy = Array.from(this.state.atletas);
        atletasCopy.push({ id: this.state.atletas.length, value: atleta });
        this.setState({ atletas: atletasCopy })
        this.setState({ nomeAtletaDigitado: atleta })
        this.setState({ numeroAtletas: this.state.atletas.length})
    }
       
    render() {
    return (
        <div>

            {this.state.nomeAtletaDigitado != '' && (
                <div>
                    <h1>Hello, {this.state.nomeAtletaDigitado}</h1>
                    <p>Total de atletas, {this.state.numeroAtletas + 1}</p>
                </div>
               )
            }
 
            <ManutencaoCadAtleta onSubmit={this.AddAtleta} />
            {this.state.atletas.length > 0 &&
                <ShowListaAtletas atletas={this.state.atletas} />
            }
             
         </div>
    );
  }
}
