import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal } from 'antd';
import { useState } from 'react';

import './index.less';
import StockFitler from './StockFitler';
import StockHistoryTrade from './StockHistoryTrade';
import StockMarketOverview from './StockMarketOverview';
import StockNews from './StockNews';
import StockTools from './StockTools';

export default function Stock() {
  const [modal, setModal] = useState('');
  const [showStockMarketOverview, setShowStockMarketOverview] = useState(true);
  const [showStockNews, setShowStockNews] = useState(false);
  const [showStockFilter, setShowStockFilter] = useState(false);

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
    <div className="Stock flex height-100">
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

        {showStockFilter && (
          <div style={{ flex: 1 }}>
            <StockFitler />
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

        <Button
          type={showStockFilter ? 'primary' : undefined}
          onClick={() => setShowStockFilter(!showStockFilter)}
        >
          StockFitler
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
