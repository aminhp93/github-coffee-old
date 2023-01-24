import User from 'features/user';
import './Header.less';
import FullscreenButton from 'components/FullscreenButton';
import React, { useState } from 'react';
import { Drawer, Space } from 'antd';

const Header = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Space>
        <div
          onMouseEnter={showDrawer}
          style={{
            position: 'fixed',
            height: '4px',
            width: '4px',
            top: 0,
            right: 0,
          }}
        />
      </Space>
      <Drawer
        title={false}
        placement={'top'}
        closable={false}
        onClose={onClose}
        open={open}
        key={'top'}
        height={50}
      >
        <div className="Header flex height-100">
          <div className="flex">
            <FullscreenButton />
          </div>
          <div>
            <User />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
