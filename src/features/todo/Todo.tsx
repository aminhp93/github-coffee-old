// ** Import react
import { useCallback, useEffect, useRef } from 'react';

// ** Import third-party libs
import { notification, Input, InputRef } from 'antd';
import { AgGridReact } from 'ag-grid-react';

// ** Import components
import CustomAgGridReact from 'components/CustomAgGridReact';
import { useAuth, AuthUserContext } from '@/context/SupabaseContext';
import { Todo } from './Todo.types';
import TodoService from './Todo.services';
import { createNewRowData } from './Todo.utils';
import TodoTableColumns from './TodoTableColumns';

const TodoPage = () => {
  const { authUser }: AuthUserContext = useAuth();
  const gridRef: React.RefObject<AgGridReact> = useRef(null);
  const inputRef = useRef<InputRef>(null);

  const handleCreate = async (data: any) => {
    try {
      if (!authUser || !authUser.id || !data) return;
      if (!gridRef?.current?.api) return;

      const requestData = {
        ...data,
        author: authUser.id,
      };
      delete requestData.id;
      const res = await TodoService.createTodo(requestData);

      //

      const itemsToUpdate: any = [];
      gridRef.current.api.forEachNodeAfterFilterAndSort(function (rowNode) {
        // only do item with id === -1
        if (rowNode.data.id === -1) {
          itemsToUpdate.push(rowNode.data);
        }
      });

      gridRef.current.api.applyTransaction({
        remove: itemsToUpdate,
      });

      addItems(undefined, res.data);

      notification.success({ message: 'Create success' });
    } catch (e: any) {
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

  const addItems = useCallback((addIndex: any, data: any) => {
    if (!gridRef?.current?.api) return;

    gridRef.current?.api.applyTransaction({
      add: data,
      addIndex: addIndex,
    });
  }, []);

  const onCellEditingStarted = useCallback((event: any) => {
    console.log('cellEditingStarted', event);
  }, []);

  const onCellEditingStopped = useCallback(async (event: any) => {
    console.log('cellEditingStopped', event);
    try {
      const requestData = {
        title: event.newValue,
      };
      await TodoService.updateTodo(event.data.id, requestData);
      notification.success({ message: 'Update success' });
    } catch (e: any) {
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

  const handlePressEnter = (e: any) => {
    // add item to aggrid
    const item = createNewRowData(e.target.value);
    addItems(0, [item]);

    // call api create
    handleCreate(item);
    if (inputRef?.current?.input) {
      inputRef.current.input.value = '';
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const dataRequest: Partial<Todo> = {
          author: authUser?.id,
        };

        const res = await TodoService.listTodo(dataRequest);
        if (res?.data as Todo[]) {
          addItems(undefined, res.data);
        }
      } catch (e) {
        notification.error({ message: 'error' });
      }
    })();
  }, [addItems, authUser?.id]);

  return (
    <div className="StockTable height-100 flex">
      <div className="height-100 width-100 ag-theme-alpine flex-1">
        <div>
          <div>Todo</div>
          <div>
            <Input ref={inputRef} onPressEnter={handlePressEnter} />
          </div>
        </div>
        <CustomAgGridReact
          columnDefs={TodoTableColumns(handleDeleteCb)}
          ref={gridRef}
          onCellEditingStarted={onCellEditingStarted}
          onCellEditingStopped={onCellEditingStopped}
          onGridReady={handleGridReady}
        />
      </div>
    </div>
  );
};

export default TodoPage;
