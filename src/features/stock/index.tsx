import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Modal } from 'antd';
import CustomFlexLayout from 'components/CustomFlexLayout';
import { IJsonModel } from 'flexlayout-react';
import { useState } from 'react';
import './index.less';
import StockHistoryTrade from './StockHistoryTrade';
import StockTools from './StockTools';
import StockMarketOverview from './StockMarketOverview';
import StockNews from './StockNews';
import StockTable from './StockTable';
import { v4 as uuidv4 } from 'uuid';

const rowId = uuidv4();
const tabSetId = uuidv4();

const Stock = () => {
  const [modal, setModal] = useState('');

  const savedLayout = localStorage.getItem('flexLayoutModel_Stock');

  let json: IJsonModel = {
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
              id: '#StockMarketOverview',
              name: 'StockMarketOverview',
              component: 'StockMarketOverview',
            },
            {
              type: 'tab',
              id: '#StockNews',
              name: 'StockNews',
              component: 'StockNews',
            },
            {
              type: 'tab',
              id: '#StockTable',
              name: 'StockTable',
              component: 'StockTable',
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

  const handleChangeMenu = (e: any) => {
    if (e.key === 'tools') {
      setModal('StockTools');
    } else if (e.key === 'stockHistoryTrade') {
      setModal('StockHistoryTrade');
    }
  };

  const menu = (
    <Menu onClick={handleChangeMenu}>
      <Menu.Item key="tools">Tools</Menu.Item>
      <Menu.Item key="stockHistoryTrade">Stock History trade</Menu.Item>
    </Menu>
  );

  return (
    <div
      className={` Stock flex height-100`}
      style={{ flexDirection: 'column' }}
    >
      <div className="Stock-header flex" style={{ margin: '8px 16px' }}>
        <div style={{ flex: 1 }}>Stock</div>
        <div className="Stock-header-menu">
          <Dropdown overlay={menu} trigger={['click']}>
            <MoreOutlined className="font-size-30 color-black" />
          </Dropdown>
        </div>
      </div>
      <div className="flex" style={{ flex: 1, overflow: 'auto' }}>
        <CustomFlexLayout
          json={json}
          componentObj={{
            StockMarketOverview: <StockMarketOverview />,
            StockNews: <StockNews />,
            StockTable: <StockTable />,
          }}
        />
      </div>

      {modal && (
        <Modal
          centered
          className="custom-modal"
          visible={true}
          onCancel={() => setModal('')}
          footer={null}
        >
          {modal === 'StockHistoryTrade' && <StockHistoryTrade />}
          {modal === 'StockTools' && <StockTools />}
        </Modal>
      )}
    </div>
  );
};

export default Stock;
