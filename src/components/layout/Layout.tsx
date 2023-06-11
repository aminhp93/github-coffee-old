// Import react
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// Import third-party libs
import { keyBy } from 'lodash';

// Import components
import Header from 'components/layout/Header';
import TagService from 'features/tag/services';
import { Tag } from 'features/tag/types';
import useTagStore from 'features/tag/store';
import useStatusStore from 'features/status/store';
import { Status } from 'features/status/types';
import StatusService from 'features/status/services';

const Layout = () => {
  const setTags = useTagStore((state) => state.setTags);
  const setStatus = useStatusStore((state) => state.setStatus);

  useEffect(() => {
    // Fetch init data
    (async () => {
      const res = await TagService.listTag();

      if (res && res.data) {
        setTags(keyBy(res.data as Tag[], 'id'));
      }
    })();
  }, [setTags]);

  useEffect(() => {
    // Fetch init data
    (async () => {
      const res = await StatusService.listStatus();

      if (res && res.data) {
        setStatus(keyBy(res.data as Status[], 'id'));
      }
    })();
  }, [setStatus]);

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
