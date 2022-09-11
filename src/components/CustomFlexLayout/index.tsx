import { IJsonModel, Layout, Model, TabNode } from 'flexlayout-react';
import 'flexlayout-react/style/light.css';
import './CustomFlexLayout.less';

import Post from 'features/post';
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
interface IProps {
  json?: IJsonModel;
}

function FlexLayout({ json }: IProps) {
  const model = Model.fromJson(json || DEFAULT_JSON);
  const factory = (node: TabNode) => {
    console.log(node);
    const component = node.getComponent();
    if (component === 'stock') {
      return <Stock />;
    } else if (component === 'post') {
      return <Post />;
    } else if (component === 'StockMarketOverview') {
      return <StockMarketOverview />;
    } else if (component === 'StockNews') {
      return <StockNews />;
    }
  };

  return (
    <div className="CustomFlexLayout relative height-100 width-100">
      <Layout model={model} factory={factory} />;
    </div>
  );
}

export default FlexLayout;