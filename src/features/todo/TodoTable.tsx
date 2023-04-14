import { useCallback, useState, useEffect, useRef } from 'react';
import CustomAgGridReact from 'components/CustomAgGridReact';

import { Todo } from './types';
import { useAuth } from '@/context/SupabaseContext';
import TodoService from './service';
import { notification } from 'antd';
import CustomLexical from 'components/customLexical/CustomLexical';

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

  const handleChangeLexical = (value: any) => {
    console.log(value);
    const newPost = {
      // title: post?.title,
      // tag: selectedTag?.id,
      author: authUser.id,
      content: value,
    };
    console.log('newPost', newPost);
    // setPost(newPost as any);
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
            <CustomLexical onChange={handleChangeLexical} />
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
