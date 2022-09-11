import CustomFlexLayout from 'components/CustomFlexLayout';
import { IJsonModel } from 'flexlayout-react';

export interface IWokrProps {}

export default function Work(props: IWokrProps) {
  const json: IJsonModel = {
    global: {
      tabEnableFloat: true,
      tabSetMinWidth: 100,
      tabSetMinHeight: 100,
      borderMinSize: 100,
    },
    borders: [
      {
        type: 'border',
        // selected: 2,
        location: 'bottom',
        children: [
          {
            type: 'tab',
            id: '#2a50a894-0744-4696-bf4e-54ae83185ebc',
            name: 'Post',
            component: 'post',
            enableClose: false,
          },
          {
            type: 'tab',
            id: '#2966f663-cf93-4efe-8d4a-e6c3bb475991',
            name: 'Post',
            component: 'post',
          },
        ],
      },
      {
        type: 'border',
        location: 'left',
        children: [
          {
            type: 'tab',
            id: '#bf47f3eb-86a7-4e56-b413-e7f8086b4b2c',
            name: 'Navigation',
            altName: 'The Navigation Tab',
            component: 'nagivation',
            enableClose: false,
          },
        ],
      },
      {
        type: 'border',
        // selected: 0,
        location: 'right',
        children: [
          {
            type: 'tab',
            id: '#a02e66f1-14b1-4403-a9f3-99f356d382c6',
            name: 'Setting',
            component: 'setting',
            enableClose: false,
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
              id: '#7df660c1-907f-4ef3-ac7e-78b8bdbbc994',
              name: 'Stock',
              component: 'stock',
            },
          ],
          active: true,
        },
      ],
    },
  };

  return <CustomFlexLayout json={json} />;
}
