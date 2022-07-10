import { useState } from 'react';
import { Modal, Menu, Dropdown, Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

import StockHistoryTrade from './StockHistoryTrade';
import StockTools from './StockTools';
import StockMarketOverview from './StockMarketOverview';
import StockNews from './StockNews';

export default function Stock() {
  const [modal, setModal] = useState('');
  const [showStockMarketOverview, setShowStockMarketOverview] = useState(true);
  const [showStockNews, setShowStockNews] = useState(true);

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
      <Menu.Item key="testBreak">Test Break (Dev mode)</Menu.Item>
    </Menu>
  );

  return (
    <div className="Stock">
      <div className="Stock-header">
        <div style={{ flex: 1 }}>Stock</div>
        <div className="Stock-header-menu">
          <Dropdown overlay={menu} trigger={['click']}>
            <MoreOutlined className="font-size-30 color-black" />
          </Dropdown>
        </div>
      </div>
      <div className="flex" style={{ flex: 1, overflow: 'hidden' }}>
        {showStockMarketOverview && (
          <div style={{ flex: 1 }}>
            <StockMarketOverview />
          </div>
        )}

        {showStockNews && (
          <div style={{ flex: 1 }}>
            <StockNews />
          </div>
        )}
      </div>
      <div className="flex" style={{ background: 'gray' }}>
        <Button
          type={showStockMarketOverview ? 'primary' : undefined}
          onClick={() => setShowStockMarketOverview(!showStockMarketOverview)}
        >
          StockMarketOverview
        </Button>

        <Button
          type={showStockNews ? 'primary' : undefined}
          onClick={() => setShowStockNews(!showStockNews)}
        >
          StockNews
        </Button>
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
}
