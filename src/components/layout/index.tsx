import Header from 'components/layout/Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div
      className="height-100"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
