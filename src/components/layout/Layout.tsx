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
import StockService from 'features/stock/service';
import { Watchlist } from 'features/stock/Stock.types';
import useStockStore from 'features/stock/Stock.store';

const Layout = () => {
  const setTags = useTagStore((state) => state.setTags);
  const setStatus = useStatusStore((state) => state.setStatus);
  const setWatchlist = useStockStore((state) => state.setWatchlist);

  useEffect(() => {
    // Fetch list tag
    (async () => {
      const res = await TagService.listTag();

      if (res?.data) {
        setTags(keyBy(res.data as Tag[], 'id'));
      }
    })();
  }, [setTags]);

  useEffect(() => {
    // Fetch list status
    (async () => {
      const res = await StatusService.listStatus();

      if (res?.data) {
        setStatus(keyBy(res.data as Status[], 'id'));
      }
    })();
  }, [setStatus]);

  useEffect(() => {
    // Fetch list watchlist
    (async () => {
      const res = await StockService.getWatchlist();

      if (res?.data) {
        setWatchlist(keyBy(res.data as Watchlist[], 'watchlistID'));
      }
    })();
  }, [setWatchlist]);

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
