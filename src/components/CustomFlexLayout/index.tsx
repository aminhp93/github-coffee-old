import { Layout, Model, TabNode, IJsonModel } from 'flexlayout-react';
import 'flexlayout-react/style/light.css';
import './CustomFlexLayout.less';

import Post from 'features/post';
import Stock from 'features/stock';

const json: IJsonModel = {
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

const model = Model.fromJson(json);

function FlexLayout() {
  const factory = (node: TabNode) => {
    const component = node.getComponent();
    if (component === 'stock') {
      return <Stock />;
    } else if (component === 'post') {
      return <Post />;
    }
  };

  return (
    <div className="CustomFlexLayout relative height-100">
      <Layout model={model} factory={factory} />;
    </div>
  );
}

export default FlexLayout;
