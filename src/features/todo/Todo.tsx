// ** Import react
import { useCallback, useEffect, useRef } from 'react';

// ** Import third-party libs
import { notification, Input, InputRef } from 'antd';
import { AgGridReact } from 'ag-grid-react';

// ** Import components
import CustomAgGridReact from 'components/customAgGridReact/CustomAgGridReact';
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
        author: authUser.id,
      };
      delete requestData.id;
      const res = await TodoService.createTodo(requestData);

      const itemsToUpdate: IRowNode[] = [];
      gridRef.current.api.forEachNodeAfterFilterAndSort(function (rowNode) {
        // only do item with id === -1
        if (rowNode.data.id === -1) {
          itemsToUpdate.push(rowNode.data);
        }
      });

      gridRef.current.api.applyTransaction({
        remove: itemsToUpdate,
      });

      addItems(undefined, res.data as Todo[]);

      notification.success({ message: 'Create success' });
    } catch (e) {
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
    if (!gridRef?.current?.api || !data) return;

    gridRef.current?.api.applyTransaction({
      add: data,
      addIndex: addIndex,
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
    if (!gridRef?.current?.api) return;
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

    gridRef.current.api.forEachNodeAfterFilterAndSort(function (
      rowNode: IRowNode
    ) {
      if (rowNode.data.id === todo.id) {
        // only do item with id === -1
        rowNode.data.status = Number(key);
        itemsToUpdate.push(rowNode.data);
        const row = gridRef.current!.api.getDisplayedRowAtIndex(
          rowNode.rowIndex!
        );
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
        />
      </div>
    </div>
  );
};

export default TodoPage;
