/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Input, List } from 'antd';
import dayjs from 'dayjs';
import parse from 'html-react-parser';
import { flatten, keyBy } from 'lodash';
import { useEffect, useState } from 'react';

import StockService from './service';

export default function StockNews() {
  const [list, setList] = useState([]);
  const [viewDetail, setViewDetail] = useState(false);
  const [newsDetail, setNewsDetail] = useState(null);
  const [searchText, setSearchText] = useState('');

  const fetch = async () => {
    const res = await StockService.getWatchlist();
    if (res?.data) {
      const listWatchlist = keyBy(res.data, 'name');

      const listWatching = listWatchlist['watching'];
      const listPromises: any = [];
      (listWatching?.symbols || []).forEach((i: string) => {
        listPromises.push(StockService.getStockNews(i));
      });
      return Promise.all(listPromises).then((res2: any) => {
        let mappedData = res2.map((i: any) => {
          return i.data.map((j: any) => {
            j.symbol = i.config.data;
            return j;
          });
        });

        mappedData = flatten(mappedData);
        mappedData = mappedData.sort((a: any, b: any) => {
          return new Date(b.date).getTime() > new Date(a.date).getTime()
            ? 1
            : -1;
        });
        setList(mappedData);
      });
    }
  };

  const fetchNewsDetail = async (id: number) => {
    const res = await StockService.getStockNewsDetail(id);
    if (res?.data) {
      setNewsDetail(res.data.content);
    }
  };

  const handleClickNews = (id: number) => {
    setViewDetail(true);
    fetchNewsDetail(id);
  };

  const handleBack = () => {
    setViewDetail(false);
    setNewsDetail(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetch();
    }, 1000 * 60);
    fetch();

    return clearInterval(interval);
  }, []);

  const filterList = list.filter((i: any) =>
    i.symbol?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="StockNews">
      {viewDetail ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            height: '100%',
          }}
        >
          <div style={{ height: '50px' }}>
            <Button size="small" onClick={handleBack}>
              Back
            </Button>
          </div>

          <div style={{ flex: 1, overflow: 'auto' }}>
            {newsDetail && parse(newsDetail)}
          </div>
        </div>
      ) : (
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Input
            placeholder="Search"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchText(e.target.value)
            }
          />
          <List
            style={{ overflow: 'auto', flex: 1 }}
            bordered
            dataSource={filterList}
            renderItem={(item: any) => (
              <List.Item
                onClick={() => handleClickNews(item.postID)}
                className={`StockNews-item flex ${
                  dayjs(item.date).format('MM-DD') === dayjs().format('MM-DD')
                    ? 'highlight'
                    : ''
                }`}
              >
                <div style={{ width: '60px' }}>
                  {dayjs(item.date).format('MM-DD')}
                </div>
                <div style={{ flex: 1 }}>
                  {item.symbol} - {item.title}
                </div>
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
}
