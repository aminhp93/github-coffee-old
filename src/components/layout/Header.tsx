import User from 'features/user';
import './Header.less';
import FullscreenButton from 'components/fullscreenButton/FullscreenButton';

const Header = () => {
  return (
    <div
      className="Header flex height-100"
      style={{
        position: 'fixed',
        height: '100px',
        width: '29px',
        bottom: 0,
        paddingBottom: '40px',
        right: 0,
        flexDirection: 'column',
      }}
    >
      <User />

      <FullscreenButton />
    </div>
  );
};

export default Header;
