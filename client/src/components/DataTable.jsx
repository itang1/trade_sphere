import { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { colors } from '../theme';

export default function DataTable({ rows, columns, getRowId, defaultPageSize = 10 }) {
  const [pageSize, setPageSize] = useState(defaultPageSize);

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      getRowId={getRowId}
      pageSize={pageSize}
      rowsPerPageOptions={[5, 10, 25]}
      onPageSizeChange={setPageSize}
      autoHeight
      disableSelectionOnClick
      components={{ Toolbar: GridToolbar }}
      componentsProps={{
        toolbar: {
          printOptions: { disableToolbarButton: true },
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 250 },
        },
      }}
      localeText={{ noRowsLabel: 'Choose filters above and press Search' }}
      sx={{
        backgroundColor: '#FFFFFF',
        borderColor: colors.border,
        '& .MuiDataGrid-columnHeaders': { backgroundColor: colors.sand, fontWeight: 600 },
        '& .MuiDataGrid-cell': { borderColor: colors.border },
        '& .MuiDataGrid-row:nth-of-type(odd)': { backgroundColor: colors.cream },
      }}
    />
  );
}
