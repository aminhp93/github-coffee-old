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

import { defaultJson } from './Work.constants';

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
