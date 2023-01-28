import User from 'features/user';
import './Header.less';
import FullscreenButton from 'components/FullscreenButton';
import { Space } from 'antd';

const Header = () => {
  return (
    <>
      <Space>
        <div
          style={{
            position: 'fixed',
            height: '40px',
            width: '100%',
            bottom: 0,

            zIndex: 1,
          }}
        >
          <div className="Header flex height-100">
            <div className="flex">
              <FullscreenButton />
            </div>
            <div>
              <User />
            </div>
          </div>
        </div>
      </Space>
    </>
  );
};

export default Header;
