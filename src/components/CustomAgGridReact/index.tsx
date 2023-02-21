import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import { forwardRef } from 'react';
import { ColDef, GridReadyEvent } from 'ag-grid-community';

interface Props {
  rowData: any;
  columnDefs: ColDef[];
  onGridReady?: (data: GridReadyEvent) => void;
  pinnedTopRowData?: any;
  getRowClass?: any;
  getRowId?: any;
}

const CustomAgGridReact = forwardRef(
  (
    {
      rowData,
      columnDefs,
      onGridReady,
      pinnedTopRowData,
      getRowClass,
      getRowId,
    }: Props,
    ref: any
  ) => {
    return (
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pinnedTopRowData={pinnedTopRowData}
        onGridReady={onGridReady}
        getRowId={getRowId}
        getRowClass={getRowClass}
        ref={ref}
        overlayLoadingTemplate={
          '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>'
        }
        sideBar={{
          toolPanels: ['columns', 'filters'],
        }}
        rowHeight={30}
        rowSelection={'single'}
        defaultColDef={{
          editable: true,
          sortable: true,
          filter: true,
          resizable: true,
        }}
      />
    );
  }
);

export default CustomAgGridReact;
