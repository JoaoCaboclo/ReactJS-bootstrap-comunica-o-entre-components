/* eslint-disable indent */
import React, { Component, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Table from 'react-bootstrap/Table';
import CallTablePadrao from '../../components/TableComponente/ReactTableStd';

function PrepareAndShowTable() {

	const [primeiroCarregamento, setPrimeiroCarregamento] = useState(true);
	const [perfil, setPerfil] = useState('');
	const [titleButton, setTitleButton] = useState('Placeholder for title');

	const columns = React.useMemo(
		() => [
			{
				Header: 'Relação das Regras',
				columns: [
					{
						Header: 'Código',
						accessor: 'codRegra',
						filter: 'fuzzyText',
					},
					{
						Header: 'Nome',
						accessor: 'nomeRegra',
						// Use our custom `fuzzyText` filter on this column
						filter: 'fuzzyText',
					},

					{
						Header: 'Descrição',
						accessor: 'descricaoVenda',
						// Use our custom `fuzzyText` filter on this column
						filter: 'fuzzyText',
					},
				],
			},
		],
		[],
	);

	return (
    	<CallTablePadrao
     		columns={columns}
			data={listaAtletas}
			perfil={perfil}
			mostrarBotoesAcao={true}
			controlePaginaNoTopo={false}
	    />
	);
}
export default PrepareAndShowTable;
