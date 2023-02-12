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
import StockDetail from 'features/stock/StockTable/StockDetail';
import moment from 'moment';

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
        StockDetail: (
          <StockDetail
            symbol=""
            dates={[moment().add(-1, 'years'), moment()]}
          />
        ),
      }}
    />
  );
};

export default Work;
