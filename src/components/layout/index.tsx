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
      <div
        style={{
          position: 'fixed',
          height: '36px',
          bottom: 0,
          right: 0,
        }}
      >
        <Header />
      </div>
    </div>
  );
};

export default Layout;
