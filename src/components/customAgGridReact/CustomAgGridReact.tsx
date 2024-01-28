import { GridOptions } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import { forwardRef, memo, useCallback, useEffect } from 'react';
import { withSize } from 'react-sizeme';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TData = any;

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
  enableRangeSelection?: boolean;
  enableCharts?: boolean;
  autoGroupColumnDef?: GridOptions['autoGroupColumnDef'];
  groupDefaultExpanded?: GridOptions['groupDefaultExpanded'];
};

interface CustomAgGridReactProps extends Props {
  gridRef: React.RefObject<AgGridReact>;
}

const CustomAgGridReact = (props: CustomAgGridReactProps) => {
  const { onGridReady: onGridReadyProps, onResize, size, gridRef } = props;

  const onGridReady = useCallback(
    (params: TData) => {
      if (onGridReadyProps) onGridReadyProps(params);
    },
    [onGridReadyProps]
  );

  useEffect(() => {
    if (onResize) onResize();
  }, [size, onResize]);

  return (
    <AgGridReact
      {...props}
      ref={gridRef}
      onGridReady={onGridReady}
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
