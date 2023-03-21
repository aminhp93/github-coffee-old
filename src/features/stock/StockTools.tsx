import { Button, Input, notification, Spin } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { chunk, minBy, orderBy } from 'lodash';
import { useEffect, useState } from 'react';
import {
  DATE_FORMAT,
  MIN_MEDIUM_TOTOL_VALUE,
  MIN_TOTAL_VALUE,
  MIN_TOTAL_VOLUME,
} from './constants';
import StockService from './service';

const headers = {
  Authorization: `Bearer ${process.env.REACT_APP_AUTHORIZATION_TOKEN}`,
};

export default function StockTools() {
  const [listWatchlists, setListWatchlists] = useState([]);
  const [loading, setLoading] = useState(false);

  const getWatchlist = async () => {
    const res = await StockService.getWatchlist();
    if (res && res.data) {
      setListWatchlists(res.data);
    }
  };

  const handleUpdateThanhKhoanVua = async () => {
    let finalList = [];
    // Get list symbol from all
    const wlAll = (
      listWatchlists.filter((i: any) => i.name === 'all')[0] as any
    ).symbols;

    // Remove list symbol in blacklist and temp_blacklist
    const wlBlacklist = (
      listWatchlists.filter((i: any) => i.name === 'blacklist')[0] as any
    ).symbols;
    finalList = wlAll.filter((i: any) => !wlBlacklist.includes(i));

    const chunkedListSymbol: any = chunk(finalList, 30);
    setLoading(true);
    let res: any = [];
    for (let i = 0; i < chunkedListSymbol.length; i++) {
      const listPromises: any = [];
      for (let j = 0; j < chunkedListSymbol[i].length; j++) {
        listPromises.push(
          StockService.getHistoricalQuotes({ symbol: chunkedListSymbol[i][j] })
        );
      }
      const partialRes = await Promise.all(listPromises);
      res = res.concat(partialRes);
    }
    setLoading(false);
    const mappedRes = orderBy(
      res
        .map((i: any) => {
          const result: any = {
            symbol: i.data[0].symbol,
            minTotalValue: (minBy(i.data, 'totalValue') as any).totalValue,
            minTotalVolume: (minBy(i.data, 'totalVolume') as any).totalVolume,
          };
          return result;
        })
        .filter((i: any) => i.minTotalValue > MIN_MEDIUM_TOTOL_VALUE),
      'minTotalValue'
    );
    const thanh_khoan_vua_wl = listWatchlists.filter(
      (i: any) => i.name === 'thanh_khoan_vua'
    )[0];
    update(
      thanh_khoan_vua_wl,
      mappedRes.map((i: any) => i.symbol)
    );
  };

  const update = async (data: any, list: any) => {
    const res = await axios({
      method: 'PUT',
      url: `https://restv2.fireant.vn/me/watchlists/${data.watchlistID}`,
      headers,
      data: {
        name: data.name,
        symbols: list,
        userName: 'minhpn.org.ec1@gmail.com',
        watchlistID: data.watchlistID,
      },
    });
    if (res && res.data) {
      notification.success({ message: 'Success' });
      getWatchlist();
    }
  };

  useEffect(() => {
    getWatchlist();
  }, []);

  if (loading) {
    return (
      <div>
        <Spin />
      </div>
    );
  }

  return (
    <div>
      <Button size="small" type="primary" onClick={handleUpdateThanhKhoanVua}>
        Update
      </Button>
      <hr />
      {listWatchlists.map((i: any) => {
        return (
          <StockToolItem
            data={i}
            key={i.watchlistID}
            dataAll={listWatchlists}
          />
        );
      })}
    </div>
  );
}

interface IStockToolItemProps {
  data: any;
  dataAll: any;
}

function StockToolItem(props: IStockToolItemProps) {
  const [data, setData] = useState(props.data);
  const [value, setValue] = useState(props.data.symbols.join(','));
  const [loading, setLoading] = useState(false);

  const handleChangeInput = (e: any) => {
    setValue(e.target.value);
  };

  const handleReset = () => {
    update([]);
  };

  const update = async (list: any) => {
    const res = await axios({
      method: 'PUT',
      url: `https://restv2.fireant.vn/me/watchlists/${data.watchlistID}`,
      headers,
      data: {
        name: data.name,
        symbols: list,
        userName: 'minhpn.org.ec1@gmail.com',
        watchlistID: data.watchlistID,
      },
    });
    if (res && res.data) {
      notification.success({ message: 'Success' });
      setData(res.data);
      setValue(res.data.symbols.join(','));
    }
  };

  const handleFilter = () => {
    setLoading(true);
    getHistorialQuoteAll();
  };

  const getHistorialQuoteAll = () => {
    const listPromises: any = [];
    data.symbols.map((j: any) => listPromises.push(getHistorialQuote(j)));
    Promise.all(listPromises).then((res) => {
      const list = res.filter((i: any) => i);
      update(list);
      setLoading(false);
      notification.success({ message: 'success' });
    });
  };

  const getHistorialQuote = async (symbol: string) => {
    if (!symbol) return;
    const startDate = dayjs().add(-1000, 'days').format(DATE_FORMAT);
    const endDate = dayjs().add(0, 'days').format(DATE_FORMAT);

    const res = await axios({
      method: 'GET',
      headers,
      url: `https://restv2.fireant.vn/symbols/${symbol}/historical-quotes?startDate=${startDate}&endDate=${endDate}&offset=0&limit=20`,
    });
    if (res.data) {
      const list = res.data.filter((i: any) => {
        return (
          i.totalVolume < MIN_TOTAL_VOLUME || i.totalValue < MIN_TOTAL_VALUE
        );
      });
      if (list.length > 0) {
        return null;
      }
      return symbol;
    }
    return null;
  };

  return (
    <div>
      {data.watchlistID} - {data.name} - {data.symbols.length}
      <Button
        size="small"
        disabled={loading}
        style={{ marginLeft: '20px' }}
        danger
        onClick={handleReset}
      >
        Reset
      </Button>
      <Button size="small" onClick={handleFilter} disabled={loading}>
        Loc Tong Gia Tri
      </Button>
      {data.name === 'all' && (
        <span>{`Von: >500, Gia: >5, Tong KL: >100000`}</span>
      )}
      {data.name === 'thanh_khoan_vua' && <span>{`Total_value > 5`}</span>}
      <div style={{ display: 'flex' }}>
        <Input
          value={value}
          onChange={handleChangeInput}
          onPressEnter={() => update(value.split(','))}
        />
      </div>
      <hr />
    </div>
  );
}
