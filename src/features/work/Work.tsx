import CustomFlexLayout from 'components/CustomFlexLayout';
import Chat from 'features/chat';
import Post from 'features/post/Post';
import Snippet from 'features/snippet';
import StockDetail from 'features/stock/StockDetail';
import StockManager from 'features/stock/stockManager/StockManager';
import StockNews from 'features/stock/StockNews';
import StockTable from 'features/stock/stockTable/StockTable';
import Test from 'features/test';
import Todo from 'features/todo/Todo';
import { IJsonModel } from 'flexlayout-react';
import { v4 as uuidv4 } from 'uuid';

const rowId = uuidv4();
const tabSetId = uuidv4();

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
      location: 'bottom',
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
        id: tabSetId,
        weight: 12.5,
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
    ],
  },
};

const Work: React.FunctionComponent = () => {
  return (
    <CustomFlexLayout
      layoutName="flexLayoutModel_Work"
      defaultJson={defaultJson}
      componentObj={{
        Post: <Post />,
        StockNews: <StockNews />,
        Chat: <Chat hideOnlineUsers />,
        Todo: <Todo />,
        Snippet: <Snippet />,
        Test: <Test />,
        StockTable: <StockTable />,
        StockDetail: <StockDetail />,
        StockManager: <StockManager />,
      }}
    />
  );
};

export default Work;