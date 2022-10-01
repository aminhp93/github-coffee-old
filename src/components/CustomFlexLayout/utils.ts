import { IJsonModel } from 'flexlayout-react';

export const DEFAULT_LAYOUT: IJsonModel = {
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
    id: '#bf8ddd18-4c40-4db2-9bb7-f66985943b44',
    children: [
      {
        type: 'tabset',
        id: '#4402c641-631c-40ba-b715-b49013cb75db',
        weight: 12.5,
        children: [
          {
            type: 'tab',
            id: '#StockMarketOverview',
            name: 'StockMarketOverview',
            component: 'StockMarketOverview',
          },
        ],
        active: true,
      },
    ],
  },
};
