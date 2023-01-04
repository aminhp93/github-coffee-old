import React from 'react';
import User from 'features/user';
import {
  HomeOutlined,
  LineChartOutlined,
  OrderedListOutlined,
  StockOutlined,
  WechatOutlined,
  AimOutlined,
  DeleteOutlined,
  SnippetsOutlined,
  FolderOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './Header.less';
import { Button, Drawer, List } from 'antd';
import FullscreenButton from 'components/FullscreenButton';

const LIST_NOT_LOGIN = [
  {
    linkTo: '/chat',
    label: 'chat',
    icon: <WechatOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/echarts',
    label: 'echarts',
    icon: <LineChartOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/post',
    label: 'post',
    icon: <OrderedListOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/taskManager',
    label: 'task manager',
    icon: <AimOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/stock',
    label: 'stock',
    icon: <StockOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/test',
    label: 'test',
    icon: <DeleteOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/snippet',
    label: 'snippet',
    icon: <SnippetsOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/example',
    label: 'example',
    icon: <FolderOutlined style={{ margin: '0 8px' }} />,
  },
  {
    linkTo: '/test',
    label: 'test',
    icon: <DeleteOutlined style={{ margin: '0 8px' }} />,
  },
];

const Header = () => {
  let navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = React.useState(false);

  return (
    <div className="Header flex height-100">
      <div className="flex">
        <Button
          size="small"
          onClick={() => setOpenDrawer(true)}
          icon={<MenuUnfoldOutlined />}
        />
        <Button
          size="small"
          style={{ marginLeft: '16px', marginRight: '16px' }}
          onClick={() => navigate('/')}
          icon={<HomeOutlined />}
        />
        <FullscreenButton />
      </div>
      <div>
        <User />
      </div>
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <List
          bordered
          dataSource={LIST_NOT_LOGIN}
          renderItem={(item) => (
            <List.Item>
              <Link onClick={() => setOpenDrawer(false)} to={item.linkTo}>
                {item.icon} {item.label}
              </Link>
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
};

export default Header;
