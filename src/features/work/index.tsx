import CustomFlexLayout from 'components/CustomFlexLayout';
import { IJsonModel } from 'flexlayout-react';

export interface IWokrProps {}

const Work: React.FunctionComponent = (props: IWokrProps) => {
  const savedLayout = localStorage.getItem('flexLayoutModel_Work');

  let json: IJsonModel = {
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
            component: 'Post',
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
            id: '#2966f663-cf93-4efe-8d4a-e6c3bb475991',
            name: 'Chat',
            component: 'Chat',
            enableClose: false,
          },
          {
            type: 'tab',
            id: '#2966f663-cf93-4efe-8d4a-e6c3bb475992',
            name: 'Todos',
            component: 'Todos',
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
              component: 'Stock',
              enableClose: false,
            },
          ],
          active: true,
        },
      ],
    },
  };

  if (savedLayout) {
    json = JSON.parse(savedLayout);
  }

  const handleOnModelChange = (data: any) => {
    console.log(data);
    localStorage.removeItem('flexLayoutModel_Work');
    localStorage.setItem('flexLayoutModel_Work', JSON.stringify(data.toJson()));
  };

  return <CustomFlexLayout json={json} onModelChange={handleOnModelChange} />;
};

export default Work;
