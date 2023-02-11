import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';

import { ColDef, GridReadyEvent } from 'ag-grid-community';

interface Props {
  rowData: any;
  columnDefs: ColDef[];
  onGridReady?: (data: GridReadyEvent) => void;
  ref?: any;
}

const CustomAgGridReact = ({
  rowData,
  columnDefs,
  onGridReady,
  ref,
}: Props) => {
  return (
    <AgGridReact
      rowData={rowData}
      columnDefs={columnDefs}
      onGridReady={onGridReady}
      ref={ref}
      overlayLoadingTemplate={
        '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>'
      }
      sideBar={{
        toolPanels: ['columns', 'filters'],
      }}
      defaultColDef={{
        editable: true,
        sortable: true,
        filter: true,
        resizable: true,
      }}
    />
  );
};

export default CustomAgGridReact;
