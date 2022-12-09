import CustomFlexLayout from 'components/CustomFlexLayout';
import Chat from 'features/chat';
import Post from 'features/post';
import Snippet from 'features/snippet';
import StockTable from 'features/stock/StockTable';
import StockNews from 'features/stock/StockNews';
import Test from 'features/test';
import Todo from 'features/todo';
import { v4 as uuidv4 } from 'uuid';
import { IJsonModel } from 'flexlayout-react';

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
      location: 'right',
      children: [
        {
          type: 'tab',
          id: '#Chat',
          name: 'Chat',
          component: 'Chat',
        },
        {
          type: 'tab',
          id: '#Todos',
          name: 'Todos',
          component: 'Todos',
        },
        {
          type: 'tab',
          id: '#Snippet',
          name: 'Snippet',
          component: 'Snippet',
        },
        {
          type: 'tab',
          id: '#Post',
          name: 'Post',
          component: 'Post',
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
        Todos: <Todo />,
        Snippet: <Snippet />,
        Test: <Test />,
        StockTable: <StockTable />,
      }}
    />
  );
};

export default Work;
