import User from 'features/user';
import './Header.less';
import FullscreenButton from 'components/FullscreenButton';

const Header = () => {
  return (
    <div className="Header flex height-100">
      <User />
      <div style={{ marginLeft: '10px' }}>
        <FullscreenButton />
      </div>
    </div>
  );
};

export default Header;
