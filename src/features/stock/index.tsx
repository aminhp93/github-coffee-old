import { MoreOutlined } from '@ant-design/icons';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';
import { Button, Dropdown, Menu, Modal } from 'antd';
import { useState } from 'react';
import './index.less';
import StockHistoryTrade from './StockHistoryTrade';
import StockMarketOverview from './StockMarketOverview';
import StockNews from './StockNews';
import StockTools from './StockTools';

const useStyles = makeStyles({
  root: {
    flexDirection: 'column',
  },
});

export default function Stock() {
  const classes = useStyles();

  const [modal, setModal] = useState('');
  const [showStockMarketOverview, setShowStockMarketOverview] = useState(true);
  const [showStockNews, setShowStockNews] = useState(false);

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
    <Box className={`${classes.root} Stock flex height-100`}>
      <Box className="Stock-header flex" mx={2} my={1}>
        <Box style={{ flex: 1 }}>Stock</Box>
        <Box className="Stock-header-menu">
          <Dropdown overlay={menu} trigger={['click']}>
            <MoreOutlined className="font-size-30 color-black" />
          </Dropdown>
        </Box>
      </Box>
      <Box className="flex" style={{ flex: 1, overflow: 'auto' }}>
        {showStockMarketOverview && (
          <Box className="flex" style={{ flex: 1 }}>
            <StockMarketOverview />
          </Box>
        )}

        {showStockNews && (
          <Box className="flex" style={{ flex: 1 }}>
            <StockNews />
          </Box>
        )}
      </Box>
      <Box className="flex" style={{ background: 'gray' }}>
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
      </Box>
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
    </Box>
  );
}
