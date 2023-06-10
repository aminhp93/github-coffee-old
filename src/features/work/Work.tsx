import CustomFlexLayout from 'components/CustomFlexLayout';
import Chat from 'features/chat';
import Post from 'features/post/Post';
import Snippet from 'features/snippet/Snippet';
import StockDetail from 'features/stock/StockDetail';
import StockManager from 'features/stock/stockManager/StockManager';
import StockNews from 'features/stock/StockNews';
import StockTable from 'features/stock/stockTable/StockTable';
import Test from 'features/test/Test';
import Todo from 'features/todo/Todo';
import { IJsonModel } from 'flexlayout-react';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import TagService from 'features/tag/services';
import { Tag } from 'features/tag/types';
import useTagStore from 'features/tag/store';
import { keyBy } from 'lodash';

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
  const setTags = useTagStore((state) => state.setTags);

  useEffect(() => {
    // Fetch init data
    (async () => {
      const res = await TagService.listTag();

      if (res && res.data) {
        setTags(keyBy(res.data as Tag[], 'id'));
      }
    })();
  }, [setTags]);

  return (
    <>
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
    </>
  );
};

export default Work;
