import { useState, useEffect } from 'react';
import { Drawer, Select, Button, DatePicker, notification } from 'antd';
import StockService from '../service';
import { DATE_FORMAT } from '../constants';
import moment from 'moment';
import { updateDataWithDate, mapDataFromStockBase } from '../utils';
import CustomAgGridReact from 'components/CustomAgGridReact';
import { keyBy } from 'lodash';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const COLUMN_DEFS = ({ handleForceUpdate }: any) => [
  {
    headerName: 'date',
    field: 'date',
  },
  {
    headerName: 'valid',
    field: 'valid',
    cellRenderer: (data: any) => {
      return (
        <div>
          {data.value ? (
            <CheckOutlined style={{ color: 'green' }} />
          ) : (
            <>
              <CloseOutlined style={{ color: 'red' }} />
              <Button onClick={() => handleForceUpdate(data)}>Update</Button>
            </>
          )}
        </div>
      );
    },
  },
];

const { RangePicker } = DatePicker;

interface Props {
  onClose: () => void;
}

const TestSupabaseData = ({ onClose }: Props) => {
  const [dates, setDates] = useState<[moment.Moment, moment.Moment]>([
    moment().add(-1, 'months'),
    moment(),
  ]);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('VPB');
  const [listData, setListData] = useState<any>([]);
  const [listAllSymbols, setListAllSymbols] = useState<string[]>([]);

  const handleForceUpdate = (data: any) => {
    updateData(data.data.date);
  };

  const getLastUpdated = async () => {
    try {
      const res: any = await StockService.getLastUpdated();
      if (res.data && res.data.length && res.data.length === 1) {
        setLastUpdated(res.data[0].last_updated);
      }
    } catch (e) {
      console.log(e);
      notification.error({ message: 'error' });
    }
  };

  const handleTest = async (symbol: string) => {
    if (dates.length !== 2) return;
    const startDate = dates[0].format(DATE_FORMAT);
    const endDate = dates[1].format(DATE_FORMAT);
    const res = await StockService.getStockDataFromFireant({
      listSymbols: [symbol],
      startDate,
      endDate,
    });
    const res2 = await StockService.getStockDataFromSupabase({
      listSymbols: [symbol],
      startDate,
      endDate,
    });

    console.log(res, res2);

    if (
      res &&
      res[0] &&
      res[0].data &&
      res2 &&
      res2.data &&
      res2.data.length === res[0].data.length
    ) {
      const mappedFireant = res[0].data.map((i: any) => {
        i.date = moment(i.date).format(DATE_FORMAT);
        return i;
      });

      const objFireant = keyBy(mappedFireant, 'date');
      const objSupabase = keyBy(res2.data, 'date');
      console.log(objFireant, objSupabase);
      const newListData: any = [];

      Object.keys(objFireant).forEach((key) => {
        const itemFireant = objFireant[key];
        const itemSupabase = objSupabase[key];
        if (
          itemFireant.dealVolume === itemSupabase.dealVolume &&
          itemFireant.priceClose === itemSupabase.priceClose &&
          itemFireant.priceHigh === itemSupabase.priceHigh &&
          itemFireant.priceLow === itemSupabase.priceLow &&
          itemFireant.priceOpen === itemSupabase.priceOpen &&
          itemFireant.totalValue === itemSupabase.totalValue &&
          itemFireant.totalVolume === itemSupabase.totalVolume
        ) {
          newListData.push({
            date: key,
            valid: true,
          });
        } else {
          newListData.push({
            date: key,
            valid: false,
          });
        }
      });

      setListData(newListData);
    }
  };

  const handleTestAll = () => {
    listAllSymbols.forEach((symbol) => {
      handleTest(symbol);
    });
  };

  const handleChangeDate = (dates: any) => {
    setDates(dates);
  };

  const updateData = async (date: string) => {
    try {
      if (!date) return;
      if (date) {
        // if have selected date, update only selected date and no udpate selected date
        updateDataWithDate(date, date, 0, listAllSymbols);
      } else {
        // if no selected date, update from last updated date to today, update selected date
        let nextCall = true;
        let offset = 0;
        while (nextCall) {
          const res = await updateDataWithDate(
            moment(lastUpdated).add(1, 'days').format(DATE_FORMAT),
            moment().format(DATE_FORMAT),
            offset,
            listAllSymbols
          );
          offset += 20;
          if (res && res.length && res[0].length < 20) {
            nextCall = false;
          }
        }

        await StockService.updateLastUpdated({
          column: 'last_updated',
          value: moment().format(DATE_FORMAT),
        });
      }
      notification.success({ message: 'success' });
    } catch (e) {
      console.log(e);
      notification.error({ message: 'error' });
    }
  };

  useEffect(() => {
    getLastUpdated();
    const init = async () => {
      const resStockBase = await StockService.getAllStockBase();

      const { list_all } = mapDataFromStockBase(resStockBase.data || []);
      setListAllSymbols(list_all);
    };
    init();
  }, []);

  return (
    <Drawer
      title={
        <div className="flex" style={{ justifyContent: 'space-between' }}>
          <div>Testing</div>
          <RangePicker
            size="small"
            onChange={handleChangeDate}
            defaultValue={dates}
            format={DATE_FORMAT}
          />
        </div>
      }
      placement="bottom"
      height="60%"
      onClose={onClose}
      open={true}
    >
      <div className="flex height-100" style={{ flexDirection: 'column' }}>
        <div
          className="flex"
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '50px',
          }}
        >
          <div>
            Last updated: {lastUpdated}
            <Button
              size="small"
              onClick={() =>
                updateData(
                  dates.length === 2 ? dates[1].format(DATE_FORMAT) : ''
                )
              }
            >
              Update data
            </Button>
          </div>
          <div>
            <Select
              showSearch
              size="small"
              defaultValue={symbol}
              style={{ width: 120 }}
              onChange={(value: string) => {
                setSymbol(value);
              }}
              options={listAllSymbols.map((i) => {
                return { value: i, label: i };
              })}
            />
            <Button size="small" onClick={() => handleTest(symbol)}>
              Test
            </Button>
          </div>
          <div>
            <Button size="small" onClick={() => handleTestAll()}>
              Test All Symbols
            </Button>
          </div>
        </div>
        <div className="flex-1 ag-theme-alpine">
          <CustomAgGridReact
            rowData={listData}
            columnDefs={COLUMN_DEFS({ handleForceUpdate })}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default TestSupabaseData;
