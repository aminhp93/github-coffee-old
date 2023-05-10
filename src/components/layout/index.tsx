import Header from 'components/layout/Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div
      className="height-100"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div className="flex-1">
        <Outlet />
      </div>

      <Header />
    </div>
  );
};

export default Layout;
