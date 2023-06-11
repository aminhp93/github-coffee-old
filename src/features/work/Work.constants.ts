import { IJsonModel } from 'flexlayout-react';
import { v4 as uuidv4 } from 'uuid';

const rowId = uuidv4();
const tabSetId1 = uuidv4();
const tabSetId2 = uuidv4();

export const defaultJson: IJsonModel = {
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

export const defaultOverviewJson: IJsonModel = {
  global: {
    tabEnableFloat: true,
    tabSetMinWidth: 100,
    tabSetMinHeight: 100,
    borderMinSize: 100,
  },
  layout: {
    type: 'row',
    id: rowId,
    children: [
      {
        type: 'row',
        id: uuidv4(),
        weight: 20,
        children: [
          {
            type: 'row',
            id: uuidv4(),
            weight: 50,
            children: [
              {
                type: 'tabset',
                id: uuidv4(),
                weight: 25,
                children: [
                  {
                    type: 'tab',
                    id: '#Post',
                    name: 'Post',
                    component: 'Post',
                  },
                ],
              },
              {
                type: 'tabset',
                id: uuidv4(),
                weight: 25,
                children: [
                  {
                    type: 'tab',
                    id: '#Chat',
                    name: 'Chat',
                    component: 'Chat',
                  },
                ],
              },
              {
                type: 'tabset',
                id: uuidv4(),
                weight: 25,
                children: [
                  {
                    type: 'tab',
                    id: '#Todo',
                    name: 'Todo',
                    component: 'Todo',
                  },
                ],
              },
              {
                type: 'tabset',
                id: uuidv4(),
                weight: 25,
                children: [
                  {
                    type: 'tab',
                    id: '#Figma',
                    name: 'Figma',
                    component: 'Figma',
                  },
                ],
              },
            ],
          },
          {
            type: 'row',
            id: uuidv4(),
            weight: 50,
            children: [
              {
                type: 'tabset',
                id: uuidv4(),
                weight: 50,
                children: [
                  {
                    type: 'tab',
                    id: '#StockTable',
                    name: 'StockTable',
                    component: 'StockTable',
                  },
                ],
              },
              {
                type: 'tabset',
                id: uuidv4(),
                weight: 50,
                children: [
                  {
                    type: 'tab',
                    id: '#StockDetail',
                    name: 'StockDetail',
                    component: 'StockDetail',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
