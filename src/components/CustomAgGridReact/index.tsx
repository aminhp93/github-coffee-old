import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import { forwardRef, memo, useCallback, useEffect } from 'react';
import { withSize } from 'react-sizeme';

interface Props {
  rowData: any;
  columnDefs: ColDef[];
  pinnedTopRowData?: any;
  getRowClass?: any;
  getRowId?: any;
  pagination?: boolean;
  paginationAutoPageSize?: boolean;
  size?: {
    width: number;
    height: number;
  };
  onResize?: any;
  onGridReady?: any;
}

interface CustomAgGridReactProps extends Props {
  gridRef: any;
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
}: CustomAgGridReactProps) => {
  console.log(size, gridRef);

  const onGridReady = useCallback(
    (params: any) => {
      onGridReadyProps && onGridReadyProps(params);
    },
    [onGridReadyProps]
  );

  useEffect(() => {
    onResize && onResize();
  }, [size, onResize]);

  return (
    <>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pinnedTopRowData={pinnedTopRowData}
        pagination={pagination}
        paginationAutoPageSize={paginationAutoPageSize}
        getRowId={getRowId}
        onGridReady={onGridReady}
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
    </>
  );
};

const WithSizeCustomAgGridReact = withSize({
  monitorHeight: true,
  monitorWidth: true,
})(CustomAgGridReact);

export default memo(
  forwardRef((props: Props, ref) => (
    <WithSizeCustomAgGridReact {...props} gridRef={ref} />
  ))
);
