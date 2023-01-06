import User from 'features/user';
import './Header.less';
import FullscreenButton from 'components/FullscreenButton';

const Header = () => {
  return (
    <div className="Header flex height-100">
      <div className="flex">
        <FullscreenButton />
      </div>
      <div>
        <User />
      </div>
    </div>
  );
};

export default Header;
