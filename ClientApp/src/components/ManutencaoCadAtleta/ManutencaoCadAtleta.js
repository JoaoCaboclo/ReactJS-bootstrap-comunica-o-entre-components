import React from 'react'

class ManutencaoCadAtleta extends React.Component {

    state = { nomeAtleta: '' }

    onFormSubmit = event => {
        event.preventDefault()
        this.props.onSubmit(this.state.nomeAtleta)
    }

    render() {
        return (
            <div className="ui segment">
                <form onSubmit={this.onFormSubmit} className="ui form">
                    <div className="field">
                        <label>Manutenção Cadastro de Atletas</label>
                        <input type="text"
                            value={this.state.nomeAtleta}
                            onChange={e => this.setState({ nomeAtleta: e.target.value })}></input>
                    </div>
                    <button type="button" onClick={this.onFormSubmit} value="Submit">Adicionar</button>
                </form>
            </div>
        )
    }
}
export default ManutencaoCadAtleta