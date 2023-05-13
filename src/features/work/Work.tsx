import CustomFlexLayout from 'components/CustomFlexLayout';
import Chat from 'features/chat';
import Post from 'features/post/Post';
import Snippet from 'features/snippet/Snippet';
import StockDetail from 'features/stock/StockDetail';
import StockManager from 'features/stock/stockManager/StockManager';
import StockNews from 'features/stock/StockNews';
import StockTable from 'features/stock/stockTable/StockTable';
import Test from 'features/test/Test';
import TodoTable from 'features/todo/TodoTable';
import { IJsonModel } from 'flexlayout-react';
import { v4 as uuidv4 } from 'uuid';
import { useHotkeys } from 'react-hotkeys-hook';
import useEditorStore from 'features/test/store';

const rowId = uuidv4();
const tabSetId1 = uuidv4();
const tabSetId2 = uuidv4();

const defaultJson: IJsonModel = {
  global: {
    tabEnableFloat: true,
    tabSetMinWidth: 100,
    tabSetMinHeight: 100,
    borderMinSize: 100,
  },
  borders: [
    {
      type: 'border',
      size: 467,
      location: 'right',
      children: [
        {
          type: 'tab',
          id: '#Todo',
          name: 'Todo',
          component: 'Todo',
          enableClose: false,
        },
      ],
    },
  ],
  layout: {
    type: 'row',
    id: rowId,
    children: [
      {
        type: 'tabset',
        id: tabSetId1,
        weight: 12.5,
        width: 620,
        children: [
          {
            type: 'tab',

            id: '#StockTable',
            name: 'StockTable',
            component: 'StockTable',
          },
        ],
        active: true,
      },
      {
        type: 'tabset',
        id: tabSetId2,
        weight: 12.5,
        children: [
          {
            type: 'tab',
            id: '#StockDetail',
            name: 'StockDetail',
            component: 'StockDetail',
          },
        ],
        active: true,
      },
    ],
  },
};

const Work: React.FunctionComponent = () => {
  const mode = useEditorStore((state) => state.mode);
  const setMode = useEditorStore((state) => state.setMode);

  // isHotkeyPressed('ctrl');

  useHotkeys(
    'shift',
    (event) => {
      event.preventDefault();
      console.log('ctrl pressed', event);
      if (event.type === 'keydown') {
        setMode('pan');
      }

      if (event.type === 'keyup') {
        setMode('select');
      }
    },
    {
      keydown: true,
      keyup: true,
    }
  );

  useHotkeys(
    'p',
    () => {
      console.log('p pressed');
      setMode('pan');
    },
    []
  );

  useHotkeys(
    's',
    () => {
      console.log('s pressed');
      setMode('select');
    },
    []
  );

  return (
    <>
      <CustomFlexLayout
        layoutName="flexLayoutModel_Work"
        defaultJson={defaultJson}
        componentObj={{
          Post: <Post />,
          StockNews: <StockNews />,
          Chat: <Chat hideOnlineUsers />,
          Todo: <TodoTable />,
          Snippet: <Snippet />,
          Test: <Test id={1} />,
          StockTable: <StockTable />,
          StockDetail: <StockDetail />,
          StockManager: <StockManager />,
        }}
      />
      <div style={{ position: 'fixed', bottom: 0, right: 100 }}>
        Mode: {mode}
      </div>
    </>
  );
};

export default Work;
