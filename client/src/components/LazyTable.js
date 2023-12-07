import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

export default function LazyTable({ route, columns, defaultPageSize, rowsPerPageOptions }) {
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1); // 1 indexed
  const [pageSize, setPageSize] = useState(defaultPageSize ?? 10);

  useEffect(() => {
    fetch(`${route}?page=${page}&page_size=${pageSize}`)
      .then(res => res.json())
      .then(resJson => setData(resJson));
  }, [route, page, pageSize]);

  const handleChangePage = (e, newPage) => {
    // Can always go to previous page (TablePagination prevents negative pages)
    // but only fetch next page if we haven't reached the end (currently have full page of data)
    if (newPage < page || data.length === pageSize) {
      // Note that we set newPage + 1 since we store as 1 indexed but the default pagination gives newPage as 0 indexed
      setPage(newPage + 1);
    }
  }

  const handleChangePageSize = (e) => {
    // When handling events such as changing a selection box or typing into a text box,
    // the handler is called with parameter e (the event) and the value is e.target.value
    const newPageSize = e.target.value;

    setPageSize(newPageSize);
    setPage(1);
  }

  const defaultRenderCell = (col, row) => {
    return <div>{row[col.field]}</div>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => <TableCell key={col.headerName}>{col.headerName}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) =>
            <TableRow key={idx}>
              {
                columns.map((col, col_idx) => <TableCell key={columns[col_idx].headerName}>
                  {columns[col_idx].renderCell ? columns[col_idx].renderCell(row) : defaultRenderCell(columns[col_idx], row)}
                </TableCell>
                )}
            </TableRow>
          )}
        </TableBody>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions ?? [5, 10, 25]}
          count={-1}
          rowsPerPage={pageSize}
          page={page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangePageSize}
        />
      </Table>
    </TableContainer>
  )
}