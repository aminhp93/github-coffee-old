import CustomFlexLayout from 'components/CustomFlexLayout';
import { IJsonModel } from 'flexlayout-react';
import './index.less';
import StockHistoryTrade from './StockHistoryTrade';
import StockTools from './StockTools';
import StockNews from './StockNews';
import StockTable from './stockTable/StockTable';

import { v4 as uuidv4 } from 'uuid';

const rowId = uuidv4();
const tabSetId = uuidv4();

let defaultJson: IJsonModel = {
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
        type: 'tabset',
        id: tabSetId,
        weight: 12.5,
        children: [
          {
            type: 'tab',
            id: '#StockTable',
            name: 'StockTable',
            component: 'StockTable',
          },

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
};

const Stock = () => {
  return (
    <div
      className={` Stock flex height-100`}
      style={{ flexDirection: 'column' }}
    >
      <CustomFlexLayout
        layoutName="flexLayoutModel_Stock"
        defaultJson={defaultJson}
        componentObj={{
          StockNews: <StockNews />,
          StockTable: <StockTable />,
          StockTools: <StockTools />,
          StockHistoryTrade: <StockHistoryTrade />,
        }}
      />
    </div>
  );
};

export default Stock;
