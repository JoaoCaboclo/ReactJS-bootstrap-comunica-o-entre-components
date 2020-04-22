import React from 'react';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

class ShowListaAtletas extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <table>
                    <head>
                        <th>ID</th>
                        <th>Nome do atleta</th>
                    </head>
                   <body>
                        {this.props.atletas.map((atleta, index) => {
                            return <tr key={index}>
                                <td>{atleta.id} - {atleta.value}</td>
                            </tr>
                       })}
                   </body>
                </table>
            </div>
        )
    }
}
export default ShowListaAtletas