// Import react
import { useEffect } from 'react';

// Import third-party libs
import { keyBy } from 'lodash';

// Import components
import TagService from 'features/tag/services';
import { Tag } from 'features/tag/types';
import useTagStore from 'features/tag/store';
import useStatusStore from 'features/status/store';
import { Status } from 'features/status/types';
import StatusService from 'features/status/services';
import StockService from 'features/stock/service';
import { StockInfo, Watchlist } from 'features/stock/Stock.types';
import useStockStore from 'features/stock/Stock.store';

const useFetchInitialData = () => {
  const setTags = useTagStore((state) => state.setTags);
  const setStatus = useStatusStore((state) => state.setStatus);
  const setWatchlist = useStockStore((state) => state.setWatchlist);
  const setStockInfo = useStockStore((state) => state.setStockInfo);

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

  useEffect(() => {
    // Fetch stock info
    (async () => {
      const res = await StockService.getStockInfo();

      if (res?.data?.length === 1) {
        setStockInfo(res.data[0] as StockInfo);
      }
    })();
  }, [setStockInfo]);
};

export default useFetchInitialData;
