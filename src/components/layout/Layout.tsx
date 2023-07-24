// Import react
import { Outlet } from 'react-router-dom';

// Import third-party libs

// Import components
import Header from 'components/layout/Header';
import useFetchInitialData from '@/hooks/useFetchInitialData';

const Layout = () => {
  useFetchInitialData();

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
