import CustomFlexLayout from 'components/customFlexLayout/CustomFlexLayout';
import Chat from 'features/chat/Chat';
import Post from 'features/post/Post';
import Snippet from 'features/snippet/Snippet';
import StockDetail from 'features/stock/StockDetail';
import StockManager from 'features/stock/stockManager/StockManager';
import StockNews from 'features/stock/StockNews';
import StockTable from 'features/stock/stockTable/StockTable';
import Figma from 'features/figma/Figma';
import Todo from 'features/todo/Todo';
import Test from 'features/test/Test';
import Booking from 'features/booking/Booking';
import { IJsonModel } from 'flexlayout-react';

type Props = {
  defaultJson: IJsonModel;
  layoutName: string;
};

const Work = ({ layoutName, defaultJson }: Props) => {
  return (
    <CustomFlexLayout
      layoutName={layoutName}
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
        Figma: <Figma />,
        Booking: <Booking />,
      }}
    />
  );
};

export default Work;
