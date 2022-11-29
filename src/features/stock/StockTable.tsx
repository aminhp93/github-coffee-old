import { StockService } from 'libs/services';
import { Table } from 'antd';
import { Dropdown, Menu } from 'antd';
import React from 'react';
import { keyBy } from 'lodash';
import { Watchlist } from 'libs/types';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

export default function StockTable() {
  const [listWatchlist, setListWatchlist] = React.useState([]);
  const [currentWatchlist, setCurrentWatchlist] =
    React.useState<Watchlist | null>(null);

  const [dataSource, setDataSource] = React.useState([]);

  const listWatchlistObj = keyBy(listWatchlist, 'watchlistID');

  React.useEffect(() => {
    (async () => {
      const res = await StockService.getWatchlist();
      if (res && res.data) {
        setListWatchlist(res.data);
      }
    })();
  }, []);

  const handleClickMenuWatchlist = (e: any) => {
    setCurrentWatchlist(listWatchlistObj[e.key]);
    const mapData: any = (listWatchlistObj[e.key] as Watchlist).symbols.map(
      (symbol: string) => {
        return {
          key: symbol,
          name: symbol,
          age: 32,
          address: '10 Downing Street',
        };
      }
    );
    setDataSource(mapData);
  };

  const menu = (
    <Menu onClick={handleClickMenuWatchlist}>
      {listWatchlist.map((i: any) => {
        return <Menu.Item key={i.watchlistID}>{i.name}</Menu.Item>;
      })}
    </Menu>
  );

  return (
    <div>
      <div>
        <Dropdown overlay={menu} trigger={['click']}>
          <div>{currentWatchlist?.name || 'Select watchlist'}</div>
        </Dropdown>
      </div>
      <div>
        <Table dataSource={dataSource} columns={columns} />;
      </div>
    </div>
  );
}
