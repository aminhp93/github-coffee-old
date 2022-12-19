import { Button, Input, notification, Spin } from 'antd';
import axios from 'axios';
import { StockService } from 'libs/services';
import {
  DATE_FORMAT,
  MIN_MEDIUM_TOTOL_VALUE,
  MIN_TOTAL_VALUE,
  MIN_TOTAL_VOLUME,
} from './constants';
import { chunk, minBy, orderBy } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';

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
          StockService.getHistoricalQuotes(
            chunkedListSymbol[i][j],
            '',
            '',
            'fireant'
          )
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
      headers: {
        authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNzE1ODY4LCJuYmYiOjE2MTM3MTU4NjgsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM3MTU4NjcsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiYzZmNmNkZWE2MTcxY2Q5NGRiNWZmOWZkNDIzOWM0OTYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.oZ8S_sTP6qVRJqY4h7g0JvXVPB0k8tm4go9pUFD0sS_sDZbC6zjelAVVNGHWJja82ewJbUEmTJrnDWAKR-rg5Pprp4DW7MzaN0lw3Bw0wEacphtyglx-H14-0Wnv_-2KMyQLP5EYH8wgyiw9I3ig_i7kHJy-XgCd__tdoMKvarkIXPzJJJY32gq-LScWb3HyZsfEdi-DEZUUzjAHR1nguY8oNmCiA6FaQCzOBU_qfgmOLWhN9ZNN1G3ODAeoOnphLJuWjHIrwPuVXy6B39eU2PtHmujtw_YOXdIWEi0lRhqV1pZOrJEarQqjdV3K5XNwpGvONT8lvUwUYGoOwwBFJg',
      },
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
      <Button type="primary" onClick={handleUpdateThanhKhoanVua}>
        Update
      </Button>
      <hr />
      {listWatchlists.map((i: any, index: number) => {
        return <StockToolItem data={i} key={index} dataAll={listWatchlists} />;
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
      headers: {
        authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNzE1ODY4LCJuYmYiOjE2MTM3MTU4NjgsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM3MTU4NjcsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiYzZmNmNkZWE2MTcxY2Q5NGRiNWZmOWZkNDIzOWM0OTYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.oZ8S_sTP6qVRJqY4h7g0JvXVPB0k8tm4go9pUFD0sS_sDZbC6zjelAVVNGHWJja82ewJbUEmTJrnDWAKR-rg5Pprp4DW7MzaN0lw3Bw0wEacphtyglx-H14-0Wnv_-2KMyQLP5EYH8wgyiw9I3ig_i7kHJy-XgCd__tdoMKvarkIXPzJJJY32gq-LScWb3HyZsfEdi-DEZUUzjAHR1nguY8oNmCiA6FaQCzOBU_qfgmOLWhN9ZNN1G3ODAeoOnphLJuWjHIrwPuVXy6B39eU2PtHmujtw_YOXdIWEi0lRhqV1pZOrJEarQqjdV3K5XNwpGvONT8lvUwUYGoOwwBFJg',
      },
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
    const startDate = moment().add(-1000, 'days').format(DATE_FORMAT);
    const endDate = moment().add(0, 'days').format(DATE_FORMAT);

    const res = await axios({
      method: 'GET',
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNjIzMDMyLCJuYmYiOjE2MTM2MjMwMzIsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM2MjMwMzIsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiZmIyZWJkNzAzNTBiMDBjMGJhMWE5ZDA5NGUwNDMxMjYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.OhgGCRCsL8HVXSueC31wVLUhwWWPkOu-yKTZkt3jhdrK3MMA1yJroj0Y73odY9XSLZ3dA4hUTierF0LxcHgQ-pf3UXR5KYU8E7ieThAXnIPibWR8ESFtB0X3l8XYyWSYZNoqoUiV9NGgvG2yg0tQ7lvjM8UYbiI-3vUfWFsMX7XU3TQnhxW8jYS_bEXEz7Fvd_wQbjmnUhQZuIVJmyO0tFd7TGaVipqDbRdry3iJRDKETIAMNIQx9miHLHGvEqVD5BsadOP4l8M8zgVX_SEZJuYq6zWOtVhlq3uink7VvnbZ7tFahZ4Ty4z8ev5QbUU846OZPQyMlEnu_TpQNpI1hg',
      },
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
        disabled={loading}
        style={{ marginLeft: '20px' }}
        danger
        onClick={handleReset}
      >
        Reset
      </Button>
      <Button onClick={handleFilter} disabled={loading}>
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
