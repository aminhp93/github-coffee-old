import User from 'features/user';
import './Header.less';
import FullscreenButton from 'components/fullscreenButton/FullscreenButton';

const Header = () => {
  return (
    <div
      className="Header flex height-100"
      style={{
        position: 'fixed',
        height: '26px',
        top: 0,
        right: 0,
        paddingRight: '30px',
      }}
    >
      <User />

      <FullscreenButton />
    </div>
  );
};

export default Header;
