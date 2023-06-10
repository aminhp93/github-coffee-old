// ** Import react
import { useCallback, useState, useEffect, useRef } from 'react';

// ** Import third-party libs
import { notification, Input } from 'antd';
import { AgGridReact } from 'ag-grid-react';

// ** Import components
import CustomAgGridReact from 'components/CustomAgGridReact';
import { useAuth, AuthUserContext } from '@/context/SupabaseContext';
import { Todo } from './Todo.types';
import TodoService from './Todo.services';
import { createNewRowData } from './Todo.utils';
import TodoTableColumns from './TodoTableColumns';

const TodoTable = () => {
  const { authUser }: AuthUserContext = useAuth();
  const gridRef: React.RefObject<AgGridReact> = useRef(null);
  const inputRef: any = useRef(null);

  const [listTodo, setListTodo] = useState<Todo[]>([]);

  const getListTodos = useCallback(
    async (data?: any) => {
      try {
        const dataRequest: Partial<Todo> = {
          author: authUser?.id,
        };

        const res = await TodoService.listTodo(dataRequest);
        if (res?.data) {
          setListTodo(res.data as Todo[]);
        }
      } catch (e) {
        notification.error({ message: 'error' });
      }
    },
    [authUser?.id]
  );

  const handleCreate = async (data: any) => {
    if (!authUser || !authUser.id || !data) return;
    try {
      const requestData = {
        ...data,
        author: authUser.id,
      };
      await TodoService.createTodo(requestData);
      notification.success({ message: 'Create success' });
    } catch (e: any) {
      notification.error({ message: 'Error create todo' });
    }
  };

  const addItems = useCallback((addIndex: any, value: string) => {
    console.log(value, addIndex);
    const newItems = [createNewRowData(value)];
    gridRef.current?.api.applyTransaction({
      add: newItems,
      addIndex: addIndex,
    });

    const requestData = {
      title: value,
    };
    handleCreate(requestData);
    inputRef.current.input.value = '';

    console.log(gridRef.current?.api);
    //  const onBtStartEditing = useCallback((key, char, pinned) => {
    // const key = 0;
    // gridRef.current.api.setFocusedCell(0, 'title');
    // gridRef.current.api.startEditingCell({
    //   rowIndex: 0,
    //   colKey: 'title',
    //   // set to 'top', 'bottom' or undefined
    //   //  rowPinned: pinned,
    //   key: key,
    //   //  charPress: char,
    // });
    //  }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDelete = () => {
    console.log('delete');
  };

  const handleGridReady = () => {
    if (!gridRef.current || !gridRef.current.api) return;
    gridRef.current.api.sizeColumnsToFit();
  };

  useEffect(() => {
    getListTodos();
  }, [getListTodos]);

  console.log(inputRef);

  return (
    <div className="StockTable height-100 flex">
      <div className="height-100 width-100 ag-theme-alpine flex-1">
        <div>
          <div>Todo</div>
          <div onClick={() => addItems(undefined, 'hello')}>New task</div>
          <div>
            <Input
              ref={inputRef}
              onPressEnter={(e: any) => {
                e.preventDefault();
                addItems(0, e.target.value);
              }}
            />
          </div>
        </div>
        <CustomAgGridReact
          rowData={listTodo}
          columnDefs={TodoTableColumns(handleDelete)}
          ref={gridRef}
          onCellEditingStarted={onCellEditingStarted}
          onCellEditingStopped={onCellEditingStopped}
          onGridReady={handleGridReady}
        />
      </div>
    </div>
  );
};

export default TodoTable;
