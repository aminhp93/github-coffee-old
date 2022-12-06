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
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './Header.less';

import type { MenuProps } from 'antd';
import { Menu, Button, Drawer, List } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

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

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('Navigation One', 'sub1', <MailOutlined />, [
    getItem(
      'Item 1',
      'g1',
      null,
      [getItem('Option 1', '1'), getItem('Option 2', '2')],
      'group'
    ),
    getItem(
      'Item 2',
      'g2',
      null,
      [getItem('Option 3', '3'), getItem('Option 4', '4')],
      'group'
    ),
  ]),

  getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [
      getItem('Option 7', '7'),
      getItem('Option 8', '8'),
    ]),
  ]),

  getItem('Navigation Three', 'sub4', <SettingOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12'),
  ]),
];
const Header = () => {
  let navigate = useNavigate();

  const [openDrawer, setOpenDrawer] = React.useState(false);

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  return (
    <div className="Header flex height-100">
      <div>
        <Button
          onClick={() => setOpenDrawer(true)}
          icon={<MenuUnfoldOutlined />}
        />
        <Button
          style={{ marginLeft: '16px' }}
          onClick={() => navigate('/')}
          icon={<HomeOutlined />}
        />
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
        <Menu
          onClick={onClick}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={items}
        />
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
