import { IJsonModel } from 'flexlayout-react';
import { v4 as uuidv4 } from 'uuid';

export const JSON_MODEL_WORKING: IJsonModel = {
  global: {
    tabEnableFloat: true,
    tabSetMinWidth: 100,
    tabSetMinHeight: 100,
    borderMinSize: 100,
  },
  layout: {
    type: 'row',
    id: uuidv4(),
    children: [
      {
        type: 'tabset',
        id: uuidv4(),
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
        id: uuidv4(),
        weight: 12.5,
        children: [
          {
            type: 'tab',
            id: '#StockDetail',
            name: 'StockDetail',
            component: 'StockDetail',
          },
          {
            type: 'tab',
            id: '#Todo',
            name: 'Todo',
            component: 'Todo',
          },
        ],
      },
    ],
  },
};

export const JSON_MODEL_INFO: IJsonModel = {
  global: {
    tabEnableFloat: true,
    tabSetMinWidth: 100,
    tabSetMinHeight: 100,
    borderMinSize: 100,
  },
  layout: {
    type: 'row',
    id: uuidv4(),
    children: [
      {
        type: 'row',
        id: uuidv4(),
        weight: 50,
        children: [
          {
            type: 'tabset',
            id: uuidv4(),
            weight: 12.5,
            width: 620,
            children: [
              {
                type: 'tab',

                id: '#Post',
                name: 'Post',
                component: 'Post',
              },
            ],
            active: true,
          },
          {
            type: 'tabset',
            id: uuidv4(),
            weight: 12.5,
            children: [
              {
                type: 'tab',
                id: '#StockNews',
                name: 'StockNews',
                component: 'StockNews',
              },
            ],
            active: true,
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
            weight: 12.5,
            width: 620,
            children: [
              {
                type: 'tab',

                id: '#StockManager',
                name: 'StockManager',
                component: 'StockManager',
              },
            ],
            active: true,
          },
        ],
      },
    ],
  },
};

export const JSON_MODEL_TOOLS: IJsonModel = {
  global: {
    tabEnableFloat: true,
    tabSetMinWidth: 100,
    tabSetMinHeight: 100,
    borderMinSize: 100,
  },
  layout: {
    type: 'row',
    id: uuidv4(),
    children: [
      {
        type: 'row',
        id: uuidv4(),
        weight: 50,
        children: [
          {
            type: 'tabset',
            id: uuidv4(),
            weight: 12.5,
            width: 620,
            children: [
              {
                type: 'tab',

                id: '#Chat',
                name: 'Chat',
                component: 'Chat',
              },
            ],
            active: true,
          },
          {
            type: 'tabset',
            id: uuidv4(),
            weight: 12.5,
            children: [
              {
                type: 'tab',
                id: '#Figma',
                name: 'Figma',
                component: 'Figma',
              },
            ],
            active: true,
          },
          {
            type: 'tabset',
            id: uuidv4(),
            weight: 12.5,
            children: [
              {
                type: 'tab',
                id: '#Booking',
                name: 'Booking',
                component: 'Booking',
              },
            ],
            active: true,
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
            weight: 12.5,
            width: 620,
            children: [
              {
                type: 'tab',
                id: '#Test',
                name: 'Test',
                component: 'Test',
              },
            ],
            active: true,
          },
          {
            type: 'tabset',
            id: uuidv4(),
            weight: 12.5,
            width: 620,
            children: [
              {
                type: 'tab',
                id: '#Snippet',
                name: 'Snippet',
                component: 'Snippet',
              },
            ],
            active: true,
          },
        ],
      },
    ],
  },
};

export const JSON_MODEL_RESET: IJsonModel = {
  global: {
    tabEnableFloat: true,
    tabSetMinWidth: 100,
    tabSetMinHeight: 100,
    borderMinSize: 100,
  },
  layout: {
    type: 'row',
    id: uuidv4(),
    children: [
      {
        type: 'tabset',
        id: uuidv4(),
        weight: 12.5,
        width: 620,
        children: [],

        active: true,
      },
    ],
  },
};

export const DROPDOWN_LIST = [
  {
    key: 'working',
    label: `working layout`,
    layoutName: JSON_MODEL_WORKING,
  },
  {
    key: 'info',
    label: `info layout`,
    layoutName: JSON_MODEL_INFO,
  },
  {
    key: 'tools',
    label: `tools layout`,
    layoutName: JSON_MODEL_TOOLS,
  },
  {
    key: 'reset',
    label: `reset layout`,
    layoutName: JSON_MODEL_RESET,
  },
];
