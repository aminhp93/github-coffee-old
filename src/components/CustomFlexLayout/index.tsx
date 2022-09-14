import { IJsonModel, Layout, Model, TabNode } from 'flexlayout-react';
import 'flexlayout-react/style/light.css';
import './CustomFlexLayout.less';

import Chat from 'features/chat';
import Post from 'features/post';
import PostDetail from 'features/post/PostDetail';
import Stock from 'features/stock';
import StockMarketOverview from 'features/stock/StockMarketOverview';
import StockNews from 'features/stock/StockNews';

const DEFAULT_JSON: IJsonModel = {
  global: { tabEnableFloat: true },
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        weight: 50,
        children: [
          {
            type: 'tab',
            name: 'stock',
            component: 'stock',
          },
        ],
      },
      {
        type: 'tabset',
        weight: 50,
        children: [
          {
            type: 'tab',
            name: 'post',
            component: 'post',
          },
        ],
      },
    ],
  },
};

const COMPONENT_OBJ: { [index: string]: any } = {
  Stock: <Stock />,
  Post: <Post />,
  StockMarketOverview: <StockMarketOverview />,
  StockNews: <StockNews />,
  Chat: <Chat hideOnlineUsers />,
  Todos: <PostDetail slug="todos" />,
};
interface IProps {
  json?: IJsonModel;
  onModelChange?: any;
}

function FlexLayout({ json, onModelChange }: IProps) {
  const model = Model.fromJson(json || DEFAULT_JSON);

  const factory = (node: TabNode) => {
    console.log(node);
    const component: any = node.getComponent();
    return COMPONENT_OBJ[component];
  };

  return (
    <div className="CustomFlexLayout relative height-100 width-100">
      <Layout
        model={model}
        factory={factory}
        // onAction={handleOnAction}
        onModelChange={onModelChange}
      />
      ;
    </div>
  );
}

export default FlexLayout;
