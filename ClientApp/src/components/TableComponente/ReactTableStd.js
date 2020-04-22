import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
	useTable,
	usePagination,
	useSortBy,
	useFilters,
	useGlobalFilter
} from "react-table";
import matchSorter from "match-sorter";
import { Link } from "react-router-dom";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { credcadApiAuth, setToken } from "../../services/api";
import { ToastContainer } from "react-toastify";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { toast } from "react-toastify";

const Styles = styled.div`
	padding: 1rem;

	table {
		width: 95%;
		border-spacing: 1;
		border: 1px solid black;

		tr {
			:last-child {
				td {
					border-bottom: 0;
				}
			}
		}

		th,
		td {
			margin: 0;
			padding: 0.5rem;
			border-bottom: 1px solid black;
			border-right: 1px solid black;
		}
	}

	.pagination {
		padding: 0.5rem;
	}
`;

function CallTablePadrao({
	columns,
	data,
	perfil,
	mostrarBotoesAcao,
	ControlePaginaNoTopo
}) {
	const [sorte, setSorte] = useState([]);
	//const [data, setData] = useState([]);

	useEffect(() => {
		carregaDados();
	}, [sorte]);

	//  Recarregador os dados apos uma exclusão	
	function carregaDados() {
		const ret = credcadApiAuth.get("regra/consultaListaRegra");
		const lucky = ret.data;
		setSorte(lucky);
		//   setData(lucky)
	}

	// Define a default UI for filtering
	function GlobalFilter({
		preGlobalFilteredRows,
		globalFilter,
		setGlobalFilter

	}) {
		const count = preGlobalFilteredRows.length;

		return (
			<span>
				Pesquisar:{" "}
				<input
					value={globalFilter || ""}
					onChange={e => {
						setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
					}}
					placeholder={`${count} records...`}
					style={{
						fontSize: "1.1rem",
						border: "0"
					}}
				/>
			</span>
		);
	}

	// Define a default UI for filtering
	function DefaultColumnFilter({
		column: { filterValue, preFilteredRows, setFilter }
	}) {
		const count = preFilteredRows.length;

		return (
			<input
				value={filterValue || ""}
				onChange={e => {
					setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
				}}
				placeholder={`Search ${count} records...`}
			/>
		);
	}

	// This is a custom filter UI for selecting
	// a unique option from a list
	function SelectColumnFilter({
		column: { filterValue, setFilter, preFilteredRows, id }
	}) {
		// Calculate the options for filtering
		// using the preFilteredRows
		const options = React.useMemo(() => {
			const options = new Set();
			preFilteredRows.forEach(row => {
				options.add(row.values[id]);
			});
			return [...options.values()];
		}, [id, preFilteredRows]);

		// Render a multi-select box
		return (
			<select
				value={filterValue}
				onChange={e => {
					setFilter(e.target.value || undefined);
				}}
			>
				<option value="">All</option>
				{options.map((option, i) => (
					<option key={i} value={option}>
						{option}
					</option>
				))}
			</select>
		);
	}

	// This is a custom filter UI that uses a
	// slider to set the filter value between a column's
	// min and max values
	function SliderColumnFilter({
		column: { filterValue, setFilter, preFilteredRows, id }
	}) {
		// Calculate the min and max
		// using the preFilteredRows

		const [min, max] = React.useMemo(() => {
			let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
			let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
			preFilteredRows.forEach(row => {
				min = Math.min(row.values[id], min);
				max = Math.max(row.values[id], max);
			});
			return [min, max];
		}, [id, preFilteredRows]);

		return (
			<>
				<input
					type="range"
					min={min}
					max={max}
					value={filterValue || min}
					onChange={e => {
						setFilter(parseInt(e.target.value, 10));
					}}
				/>
				<button onClick={() => setFilter(undefined)}>Off</button>
			</>
		);
	}

	// This is a custom UI for our 'between' or number range
	// filter. It uses two number boxes and filters rows to
	// ones that have values between the two
	function NumberRangeColumnFilter({
		column: { filterValue = [], preFilteredRows, setFilter, id }
	}) {
		const [min, max] = React.useMemo(() => {
			let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
			let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
			preFilteredRows.forEach(row => {
				min = Math.min(row.values[id], min);
				max = Math.max(row.values[id], max);
			});
			return [min, max];
		}, [id, preFilteredRows]);

		return (
			<div
				style={{
					display: "flex"
				}}
			>
				<input
					value={filterValue[0] || ""}
					type="number"
					onChange={e => {
						const val = e.target.value;
						setFilter((old = []) => [
							val ? parseInt(val, 10) : undefined,
							old[1]
						]);
					}}
					placeholder={`Min (${min})`}
					style={{
						width: "70px",
						marginRight: "0.5rem"
					}}
				/>
				to
				<input
					value={filterValue[1] || ""}
					type="number"
					onChange={e => {
						const val = e.target.value;
						setFilter((old = []) => [
							old[0],
							val ? parseInt(val, 10) : undefined
						]);
					}}
					placeholder={`Max (${max})`}
					style={{
						width: "70px",
						marginLeft: "0.5rem"
					}}
				/>
			</div>
		);
	}

	function fuzzyTextFilterFn(rows, id, filterValue) {
		return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
	}

	// Let the table remove the filter if the string is empty
	fuzzyTextFilterFn.autoRemove = val => !val;

	async function removerRegra(id, lista) {
		try {
			const ret = await credcadApiAuth.delete("regra/deleteRegra", {
				params: {
					idRegra: id
				}
			});
			carregaDados();
			window.location.reload();
			toast.success("Regra removida com sucesso.");
		} catch (ex) {
			toast.error(ex.response.data.Message);
		} finally {
			//    window.location.reload();
		}
	}

	function ShowReactTablePadrao({
		excluirRegistro,
		columns,
		data,
		perfil,
		mostrarBotoesAcao,
		ControlePaginaNoTopo,
		props
	}) {
		// Use the state and functions returned from useTable to build your UI

		const filterTypes = React.useMemo(
			() => ({
				// Add a new fuzzyTextFilterFn filter type.
				fuzzyText: fuzzyTextFilterFn,
				// Or, override the default text filter to use
				// "startWith"
				text: (rows, id, filterValue) => {
					return rows.filter(row => {
						const rowValue = row.values[id];
						return rowValue !== undefined
							? String(rowValue)
								.toLowerCase()
								.startsWith(String(filterValue).toLowerCase())
							: true;
					});
				}
			}),
			[]
		);

		const defaultColumn = React.useMemo(
			() => ({
				// Let's set up our default Filter UI
				Filter: DefaultColumnFilter
			}),
			[]
		);

		const {
			getTableProps,
			getTableBodyProps,
			headerGroups,
			prepareRow,
			page, // Instead of using 'rows', we'll use page,
			// which has only the rows for the active page

			// The rest of these things are super handy, too ;)
			canPreviousPage,
			canNextPage,
			pageOptions,
			pageCount,
			gotoPage,
			nextPage,
			previousPage,
			setPageSize,
			state: { pageIndex, pageSize },
			rows,
			state,
			flatColumns,
			preGlobalFilteredRows,
			setGlobalFilter
		} = useTable(
			{
				columns,
				data,
				defaultColumn, // Be sure to pass the defaultColumn option
				// filterTypes,
				initialState: { pageIndex: 0 }
			},
			useFilters, // useFilters!
			useGlobalFilter, // useGlobalFilter!
			useSortBy,
			usePagination
		);

		// Render the UI for your table
		return (
			<>
				{/*  <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
        </code>
      </pre> */}


				{ControlePaginaNoTopo && (
					<div className="pagination">
						<span>
							Página{" "}
							<strong>
								{pageIndex + 1} of {pageOptions.length}
							</strong>{" "}
						</span>
						<span>
							| Ir para página:{" "}
							<input
								type="number" min="1" max={pageOptions.length}
								defaultValue={pageIndex + 1}
								onChange={e => {
									const page = e.target.value ? Number(e.target.value) - 1 : 0;
									gotoPage(page);
								}}
								style={{ width: "100px" }}
							/>
						</span>{" "}
						<select
							value={pageSize}
							onChange={e => {
								setPageSize(Number(e.target.value));
							}}
						>
							{[10, 20, 30, 40, 50].map(pageSize => (
								<option key={pageSize} value={pageSize}>
									Mostrando {pageSize} registros por página
								</option>
							))}
						</select>
					</div>
				)}

				<table {...getTableProps()}>
					<thead>
						{headerGroups.map(headerGroup => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{mostrarBotoesAcao && <th></th>}

								{headerGroup.headers.map(column => (
									//<th {...column.getHeaderProps()}>{column.render('Header')}</th>
									<th {...column.getHeaderProps(column.getSortByToggleProps())}>
										{column.render("Header")}
										{/* Render the columns filter UI */}
										{/* <div>{column.canFilter ? column.render('Filter') : null}</div> */}
										<span>
											{column.isSorted
												? column.isSortedDesc
													? " 🔽"
													: " 🔼"
												: ""}
										</span>
									</th>
								))}
							</tr>
						))}

						<tr>
							<th
								colSpan={20}   // flatColumns.length + 1
								style={{
									textAlign: "left"
								}}
							>
								<GlobalFilter
									preGlobalFilteredRows={preGlobalFilteredRows}
									globalFilter={state.globalFilter}
									setGlobalFilter={setGlobalFilter}
								/>
							</th>
						</tr>
					</thead>
					<tbody {...getTableBodyProps()}>
						{page.map((row, i) => {
							prepareRow(row);
							return (
								<tr {...row.getRowProps()}>
									{mostrarBotoesAcao && (
										<td>
											<div className="col-4">
												<Link
													to={`/regra-editar/${row.values.codRegra}`}
													aling="center"
													title="Editar Regra"
												>
													<FontAwesomeIcon icon={faEdit} />
												</Link>
											</div>
											{perfil == "TI" && (
												<div className="col-4">
													<a
														label="Delete"
														className="text-danger"
														onClick={event => {
															if (
																window.confirm(
																	"Deseja realmente excluir a regra: [ " +
																	row.values.codRegra +
																	" - " +
																	row.values.nomeRegra.trim() +
																	"? ]"
																)
															)
																removerRegra(row.values.codRegra, data);
														}}
													>
														<FontAwesomeIcon icon={faTrash} />
													</a>
												</div>
											)}
										</td>
									)}

									{row.cells.map(cell => {
										return (
											<td {...cell.getCellProps()}>{cell.render("Cell")}</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
				<br />
				{!ControlePaginaNoTopo && (
					<div className="pagination">
						Página{" "}
						<strong>
							{pageIndex + 1} of {pageOptions.length}
						</strong>{" "}
						<span>
							| Ir para página:{" "}
							<input
								type="number" min="1" max={pageOptions.length}
								defaultValue={pageIndex + 1}
								onChange={e => {
									const page = e.target.value ? Number(e.target.value) - 1 : 0;
									gotoPage(page);
								}}
								style={{ width: "100px" }}
							/>
						</span>{" "}
						<select
							value={pageSize}
							onChange={e => {
								setPageSize(Number(e.target.value));
							}}
						>
							{[10, 20, 30, 40, 50].map(pageSize => (
								<option key={pageSize} value={pageSize}>
									Mostrando {pageSize} registros por página
								</option>
							))}
						</select>
					</div>
				)
				}
				<button onClick={props.doWhatever}>{props.title}</button>

			</>
		);
	}

	/* function filterGreaterThan(rows, id, filterValue) {
	return rows.filter(row => {
	  const rowValue = row.values[id]
	  return rowValue >= filterValue
	})
	} */

	// This is an autoRemove method on the filter function that
	// when given the new filter value and returns true, the filter
	// will be automatically removed. Normally this is just an undefined
	// check, but here, we want to remove the filter if it's not a number
	// filterGreaterThan.autoRemove = val => typeof val !== 'number'

	return (
		<Styles>
			<ShowReactTablePadrao
				columns={columns}
				data={data}
				perfil={perfil}
				mostrarBotoesAcao={mostrarBotoesAcao}
				ControlePaginaNoTopo={ControlePaginaNoTopo}
				props
			/>
		</Styles>
	);
}
export default CallTablePadrao;
