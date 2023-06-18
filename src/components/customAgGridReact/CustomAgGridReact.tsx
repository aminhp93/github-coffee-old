import React from 'react';
import { GridOptions } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import { forwardRef, memo, useCallback, useEffect } from 'react';
import { withSize } from 'react-sizeme';

type TData = any;

type Props = {
  rowData?: GridOptions['rowData'];
  columnDefs: GridOptions['columnDefs'];
  pinnedTopRowData?: GridOptions['pinnedTopRowData'];
  getRowClass?: GridOptions['getRowClass'];
  getRowId?: GridOptions['getRowId'];
  pagination?: GridOptions['pagination'];
  paginationAutoPageSize?: GridOptions['paginationAutoPageSize'];
  size?: {
    width: number;
    height: number;
  };
  onResize?: () => void;
  onGridReady?: GridOptions['onGridReady'];
  onCellEditingStarted?: GridOptions['onCellEditingStarted'];
  onCellEditingStopped?: GridOptions['onCellEditingStopped'];
};

interface CustomAgGridReactProps extends Props {
  gridRef: React.RefObject<AgGridReact>;
}

const CustomAgGridReact = ({
  rowData,
  columnDefs,
  pinnedTopRowData,
  getRowClass,
  getRowId,
  pagination,
  paginationAutoPageSize,
  size,
  gridRef,
  onResize,
  onGridReady: onGridReadyProps,
  onCellEditingStarted,
  onCellEditingStopped,
}: CustomAgGridReactProps) => {
  const onGridReady = useCallback(
    (params: TData) => {
      onGridReadyProps && onGridReadyProps(params);
    },
    [onGridReadyProps]
  );

  useEffect(() => {
    onResize && onResize();
  }, [size, onResize]);

  return (
    <AgGridReact
      rowData={rowData}
      columnDefs={columnDefs}
      pinnedTopRowData={pinnedTopRowData}
      pagination={pagination}
      paginationAutoPageSize={paginationAutoPageSize}
      getRowId={getRowId}
      onGridReady={onGridReady}
      onCellEditingStarted={onCellEditingStarted}
      onCellEditingStopped={onCellEditingStopped}
      getRowClass={getRowClass}
      ref={gridRef}
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
};

const WithSizeCustomAgGridReact = withSize({
  monitorHeight: true,
  monitorWidth: true,
})(CustomAgGridReact);

export default memo(
  forwardRef((props: Props, ref) => (
    <WithSizeCustomAgGridReact
      {...props}
      gridRef={ref as React.RefObject<AgGridReact>}
    />
  ))
);
