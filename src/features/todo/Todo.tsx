// ** Import react
import { useCallback, useEffect, useRef, useMemo } from 'react';

// ** Import third-party libs
import { notification, Input, InputRef } from 'antd';
import { AgGridReact } from 'ag-grid-react';

// ** Import components
import CustomAgGridReact, {
  TData,
} from 'components/customAgGridReact/CustomAgGridReact';
import { useAuth, AuthUserContext } from '@/context/SupabaseContext';
import { Todo } from './Todo.types';
import TodoService from './Todo.services';
import { createNewRowData } from './Todo.utils';
import TodoTableColumns from './TodoTableColumns';
import { IRowNode } from 'ag-grid-community';

const TodoPage = () => {
  const { authUser }: AuthUserContext = useAuth();
  const gridRef: React.RefObject<AgGridReact> = useRef(null);
  const inputRef = useRef<InputRef>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreate = async (data: any) => {
    try {
      if (!authUser?.id || !data) return;
      if (!gridRef?.current?.api) return;

      const requestData = {
        ...data,
        status: 1,
        author: authUser.id,
      };
      delete requestData.id;
      const res = await TodoService.createTodo(requestData);

      const itemsToUpdate: IRowNode[] = [];

      const selectedNodes = gridRef.current.api.getSelectedNodes();

      selectedNodes.forEach((node) => {
        if (node.data.id === -1) {
          // only do item with id === -1
          itemsToUpdate.push(node.data);
        }
      });

      gridRef.current.api.applyTransaction({
        remove: itemsToUpdate,
      });

      addItems(undefined, res.data as Todo[]);

      notification.success({ message: 'Create success' });
    } catch (e) {
      console.log(e);
      notification.error({ message: 'Error create todo' });
    }
  };

  const handleDelete = async (todo: Todo) => {
    try {
      if (!todo) return;
      await TodoService.deleteTodo(todo.id);
      notification.success({ message: 'Delete success' });
    } catch (e) {
      notification.error({ message: 'Error delete todo' });
    }
  };

  const addItems = useCallback((addIndex?: number, data?: Todo[]) => {
    if (!gridRef?.current?.api || !data || data[0].id === -1) return;
    console.log(data);

    gridRef.current?.api.applyTransaction({
      add: data,
      addIndex: addIndex,
    });
    gridRef.current.api.setFilterModel({
      status: {
        type: 'set',
        values: [null, '2', '1'],
      },
    });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCellEditingStarted = useCallback((event: any) => {
    console.log('cellEditingStarted', event);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCellEditingStopped = useCallback(async (event: any) => {
    console.log('cellEditingStopped', event);
    try {
      const requestData = {
        title: event.newValue,
      };
      await TodoService.updateTodo(event.data.id, requestData);
      notification.success({ message: 'Update success' });
    } catch (e) {
      notification.error({ message: 'Error Update todo' });
    }
  }, []);

  const handleDeleteCb = () => {
    console.log('handleDelete');
    if (!gridRef?.current?.api) return;
    const selectedData = gridRef.current.api.getSelectedRows();
    if (!selectedData || selectedData.length === 0) return;

    // remove items from aggrid
    onRemoveSelected();

    // call api delete
    if (selectedData.length === 1) {
      handleDelete(selectedData[0]);
    }
  };

  const onRemoveSelected = useCallback(() => {
    if (!gridRef?.current?.api) return;

    const selectedData = gridRef.current.api.getSelectedRows();
    gridRef.current.api.applyTransaction({
      remove: selectedData,
    });
  }, []);

  const handleGridReady = () => {
    console.log(gridRef?.current?.api);
    if (!gridRef?.current?.api) return;
    console.log(120);

    gridRef.current.api.sizeColumnsToFit();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePressEnter = (e: any) => {
    // add item to aggrid
    const item = createNewRowData(e.target.value);
    addItems(0, [item as Todo]);

    // call api create
    handleCreate(item);
    if (inputRef?.current?.input) {
      inputRef.current.input.value = '';
    }
  };

  const handleResize = () => {
    if (!gridRef?.current?.api) return;
    gridRef.current.api.sizeColumnsToFit();
  };

  useEffect(() => {
    (async () => {
      try {
        const dataRequest: Partial<Todo> = {
          author: authUser?.id,
        };

        const res = await TodoService.listTodo(dataRequest);
        if (res?.data) {
          addItems(undefined, res.data as Todo[]);
        }
      } catch (e) {
        notification.error({ message: 'error' });
      }
    })();
  }, [addItems, authUser?.id]);

  const handleUpdate = async (key: string, todo: Todo) => {
    if (!gridRef?.current?.api) return;

    const itemsToUpdate: IRowNode[] = [];
    const rows: IRowNode[] = [];

    const selectedNodes = gridRef.current.api.getSelectedNodes();

    selectedNodes.forEach((node) => {
      if (node.data.id === todo.id) {
        // only do item with id === -1
        node.data.status = Number(key);
        itemsToUpdate.push(node.data);
        const row = gridRef.current!.api.getDisplayedRowAtIndex(node.rowIndex!);
        if (row) {
          rows.push(row);
        }
      }
    });

    gridRef.current.api.applyTransaction({
      update: itemsToUpdate,
    });

    gridRef.current.api.redrawRows({ rowNodes: rows });
    try {
      const requestData = {
        status: Number(key),
      };
      await TodoService.updateTodo(todo.id, requestData);
      notification.success({ message: 'Update success' });
    } catch (e) {
      notification.error({ message: 'Error Update todo' });
    }
  };

  const autoGroupColumnDef = useMemo(() => {
    return {
      cellRendererSelector: (params: TData) => {
        if (['Australia', 'Norway'].includes(params.node.key)) {
          return; // use Default Cell Renderer
        }
        return { component: 'agGroupCellRenderer' };
      },
      minWidth: 150,
    };
  }, []);

  return (
    <div className="StockTable height-100 flex">
      <div className="height-100 width-100 ag-theme-alpine flex-1">
        <div>
          <Input ref={inputRef} onPressEnter={handlePressEnter} />
        </div>

        <CustomAgGridReact
          ref={gridRef}
          columnDefs={TodoTableColumns({
            handleDelete: handleDeleteCb,
            handleUpdate,
          })}
          onCellEditingStarted={onCellEditingStarted}
          onCellEditingStopped={onCellEditingStopped}
          onGridReady={handleGridReady}
          onResize={handleResize}
          autoGroupColumnDef={autoGroupColumnDef}
          groupDefaultExpanded={1}
        />
      </div>
    </div>
  );
};

export default TodoPage;
