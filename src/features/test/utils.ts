import { Item } from './schema/item.schema';

const fakeItemsID = () => {
  const items = [];
  for (let i = 2; i < 105; i++) {
    items.push(String(i));
  }
  return items;
};

const fakeItems = () => {
  const items = [];
  for (let i = 0; i < 100; i++) {
    const item = {
      id: `${i + 5}`,
      type: 'item',
      content: [],
      properties: {},
      legacy: {
        itemType: 'Rectangle',
        itemProperties: {
          transform: {
            x: Math.floor(Math.random() * 200) + 100,
            y: Math.floor(Math.random() * 200) + 100,
            width: Math.floor(Math.random() * 200) + 100,
            height: Math.floor(Math.random() * 200) + 100,
          },
        },
      },
    };
    items.push(item);
  }
  return items;
};

export const getTransformStyle = (item: Item) => {
  const anchorProps = item?.legacy?.itemProperties?.transform?.anchor;
  const rotation = item?.legacy?.itemProperties?.transform?.rotation || 0;
  const scale = item?.legacy?.itemProperties?.transform?.scale || 1;
  let anchor = [-50, -50];

  switch (anchorProps) {
    case 'ct':
      anchor = [-50, 0];
      break;
    case 'rt':
      anchor = [-100, 0];
      break;
    case 'rc':
      anchor = [-100, -50];
      break;
    case 'rb':
      anchor = [-100, -100];
      break;
    case 'cb':
      anchor = [-50, -100];
      break;
    case 'lb':
      anchor = [0, -100];
      break;
    case 'lc':
      anchor = [0, -50];
      break;
    case 'lt':
      anchor = [0, 0];
      break;
    default:
      anchor = [-50, -50];
      break;
  }
  return `translate(${anchor[0]}%, ${anchor[1]}%) rotate(${rotation}deg) scale(${scale})`;
};

export const LIST_ITEM = [
  {
    id: '1',
    type: 'view',
    properties: {},
    legacy: {
      viewProperties: {
        dimensions: [2000, 1000],
      },
      itemProperties: {
        transform: {
          zIndex: -1,
          hello: 'world',
        },
      },
    },
    content: fakeItemsID(),
  },
  {
    id: '2',
    type: 'item',
    content: [],
    properties: {},
    legacy: {
      itemType: 'Circle',
      itemProperties: {
        transform: {
          x: 400,
          y: 400,
          width: 100,
          // rotation: 30,
          scale: 2,
        },
      },
    },
  },
  {
    id: '3',
    type: 'item',
    content: [],
    properties: {},
    legacy: {
      itemType: 'Rectangle',
      itemProperties: {
        transform: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
        },
      },
    },
  },
  {
    id: '4',
    type: 'item',
    content: [],
    properties: {},
    legacy: {
      itemType: 'Triangle',
      itemProperties: {
        transform: {
          x: 200,
          y: 200,
          width: 84,
        },
      },
    },
  },
  ...fakeItems(),
];
