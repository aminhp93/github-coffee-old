import { useCallback, useState, useEffect, useRef } from 'react';
import CustomAgGridReact from 'components/CustomAgGridReact';

import { Todo } from './types';
import { useAuth } from '@/context/SupabaseContext';
import TodoService from './service';
import { notification } from 'antd';
import CustomPlate from 'components/CustomPlate';
import { DEFAULT_PLATE_VALUE } from 'components/CustomPlate/utils';
import { CONFIG } from 'components/CustomPlate/config/config';
import { v4 as uuidv4 } from 'uuid';

const createNewRowData = () => {
  return {
    title: '',
    description: '',
    isDone: false,
  };
};

const TodoTableColumns = () => {
  return [
    {
      headerName: 'Title',
      field: 'title',
      suppressMenu: true,
      width: 80,
      cellRenderer: (data: any) => {
        if (!data.data.id) {
          return <input />;
        } else {
          return data.data.title;
        }
      },
    },
  ];
};

const TodoTable = () => {
  const { authUser }: any = useAuth();
  const gridRef: any = useRef();
  const [value, setValue] = useState(DEFAULT_PLATE_VALUE);
  const [plateId, setPlateId] = useState(uuidv4());

  const [listTodo, setListTodo] = useState<Todo[]>([]);

  const getListTodos = useCallback(
    async (data?: any) => {
      try {
        const dataRequest: Partial<Todo> = {
          author: authUser?.id,
        };

        const res = await TodoService.listTodo(dataRequest);
        if (res?.data) {
          setListTodo(res.data);
        }
      } catch (e) {
        notification.error({ message: 'error' });
      }
    },
    [authUser?.id]
  );

  const addItems = useCallback((addIndex: any) => {
    const newItems = [createNewRowData()];
    gridRef.current.api.applyTransaction({
      add: newItems,
      addIndex: addIndex,
    });
    //  const onBtStartEditing = useCallback((key, char, pinned) => {
    const key = 0;
    gridRef.current.api.setFocusedCell(0, 'title');
    gridRef.current.api.startEditingCell({
      rowIndex: 0,
      colKey: 'title',
      // set to 'top', 'bottom' or undefined
      //  rowPinned: pinned,
      key: key,
      //  charPress: char,
    });
    //  }, []);
  }, []);

  const onCellEditingStarted = useCallback((event: any) => {
    console.log('cellEditingStarted', event);
  }, []);

  const onCellEditingStopped = useCallback((event: any) => {
    console.log('cellEditingStopped', event);
  }, []);

  const handleChange = (data: any) => {
    console.log(data);
    setValue(data);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      console.log('enter');
      setValue(DEFAULT_PLATE_VALUE);
      setPlateId(uuidv4());
    }
  };

  useEffect(() => {
    getListTodos();
  }, [getListTodos]);

  return (
    <div className="StockTable height-100 flex">
      <div className="height-100 width-100 ag-theme-alpine flex-1">
        <div>
          <div>Todo</div>
          <div onClick={() => addItems(undefined)}>New task</div>
          <div>
            <CustomPlate
              hideToolBar
              id={String(plateId)}
              value={value}
              onChange={handleChange}
              editableProps={{
                ...CONFIG.editableProps,
                onKeyDown: handleKeyDown,
              }}
            />
          </div>
        </div>
        <CustomAgGridReact
          rowData={listTodo}
          columnDefs={TodoTableColumns()}
          ref={gridRef}
          onCellEditingStarted={onCellEditingStarted}
          onCellEditingStopped={onCellEditingStopped}
        />
      </div>
    </div>
  );
};

export default TodoTable;
