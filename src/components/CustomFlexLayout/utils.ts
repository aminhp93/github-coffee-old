import { IJsonModel } from 'flexlayout-react';
import { v4 as uuidv4 } from 'uuid';

const rowId = uuidv4();
const tabSetId = uuidv4();

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
    id: rowId,
    children: [
      {
        type: 'tabset',
        id: tabSetId,
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
