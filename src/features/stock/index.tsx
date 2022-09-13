import { MoreOutlined } from '@ant-design/icons';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';
import { Dropdown, Menu, Modal } from 'antd';
import CustomFlexLayout from 'components/CustomFlexLayout';
import { IJsonModel } from 'flexlayout-react';
import { useState } from 'react';
import './index.less';
import StockHistoryTrade from './StockHistoryTrade';
import StockTools from './StockTools';

const useStyles = makeStyles({
  root: {
    flexDirection: 'column',
  },
});

const Stock = () => {
  const classes = useStyles();

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
      id: '#bf8ddd18-4c40-4db2-9bb7-f66985943b44',
      children: [
        {
          type: 'tabset',
          id: '#4402c641-631c-40ba-b715-b49013cb75db',
          weight: 12.5,
          children: [
            {
              type: 'tab',
              id: '#7df660c1-907f-4ef3-ac7e-78b8bdbbc993',
              name: 'StockMarketOverview',
              component: 'StockMarketOverview',
            },
            {
              type: 'tab',
              id: '#2966f663-cf93-4efe-8d4a-e6c3bb475992',
              name: 'StockNews',
              component: 'StockNews',
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
    localStorage.removeItem('flexLayoutModel_Stock');
    localStorage.setItem(
      'flexLayoutModel_Stock',
      JSON.stringify(data.toJson())
    );
  };

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
        <CustomFlexLayout json={json} onModelChange={handleOnModelChange} />
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
};

export default Stock;
