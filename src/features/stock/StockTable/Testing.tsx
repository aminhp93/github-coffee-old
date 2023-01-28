import { Drawer, Button, notification, Table, DatePicker, Divider } from 'antd';
import {
  DATE_FORMAT,
  DEFAULT_FILTER,
  DEFAULT_START_DATE,
  DEFAULT_END_DATE,
} from '../constants';
import StockService from '../service';
import moment from 'moment';
import {
  getDataFromSupabase,
  getDataFromFireant,
  getBackTestDataOffline,
  getDataSource,
  createBackTestData,
  updateDataWithDate,
} from '../utils';

import type { DatePickerProps } from 'antd';

import { useEffect, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const UPDATE_STATUS_COLUMNS = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'date',
    dataIndex: 'date',
    key: 'date',
    render: (data: any) => {
      return moment(data).format(DATE_FORMAT);
    },
  },
  {
    title: 'status',
    dataIndex: 'status',
    key: 'status',
    render: (data: any) => {
      return data ? (
        <CheckCircleOutlined style={{ marginRight: '4px', color: 'green' }} />
      ) : (
        <CloseCircleOutlined style={{ color: 'red' }} />
      );
    },
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const Testing = ({ open, onClose }: Props) => {
  const [listUpdateStatus, setListUpdateStatus] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [dataFromSupabase, setDataFromSupabase] = useState<any>([]);
  const [dataFromFireant, setDataFromFireant] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);

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

  const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
    setSelectedDate(date);
  };

  const updateData = async () => {
    if (selectedDate) {
      // if have selected date, update only selected date and no udpate selected date
      updateDataWithDate(
        selectedDate.format(DATE_FORMAT),
        selectedDate.format(DATE_FORMAT),
        0
      );
    } else {
      // if no selected date, update from last updated date to today, update selected date
      let nextCall = true;
      let offset = 0;
      while (nextCall) {
        const res = await updateDataWithDate(
          moment(lastUpdated).add(1, 'days').format(DATE_FORMAT),
          moment().format(DATE_FORMAT),
          offset
        );
        console.log(res);
        offset += 20;
        if (res && res.length && res[0].length < 20) {
          nextCall = false;
        }
      }
      try {
        const res = await StockService.updateLastUpdated({
          column: 'last_updated',
          value: moment().format(DATE_FORMAT),
        });
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleTest = async () => {
    const startDate = DEFAULT_START_DATE.format(DATE_FORMAT);
    const endDate = DEFAULT_END_DATE.format(DATE_FORMAT);
    const supabaseData = await getDataFromSupabase({ startDate, endDate });
    const fireantData = await getDataFromFireant({ startDate, endDate });

    const newDataSupabase = getDataSource(supabaseData, DEFAULT_FILTER);
    const newDataFireant = getDataSource(fireantData, DEFAULT_FILTER);

    const supabaseDataBacktest = await getBackTestDataOffline({
      database: 'supabase',
      dataSource: newDataSupabase,
      fullDataSource: supabaseData,
    });
    const fireantDataBacktest = await getBackTestDataOffline({
      database: 'supabase',
      dataSource: newDataFireant,
      fullDataSource: fireantData,
    });
    console.log(supabaseDataBacktest, fireantDataBacktest);
    setDataFromSupabase(supabaseDataBacktest);
    setDataFromFireant(fireantDataBacktest);
  };

  useEffect(() => {
    getLastUpdated();
  }, []);

  return (
    <Drawer
      title={
        <div className="flex" style={{ justifyContent: 'space-between' }}>
          <div>Testing</div>
          <div>Last updated: {lastUpdated}</div>
        </div>
      }
      placement="bottom"
      onClose={onClose}
      open={open}
    >
      <div className="height-100 flex">
        <div className="flex-1">
          <div>
            <Button size="small" onClick={updateData}>
              Update data
            </Button>
            <DatePicker size="small" onChange={onChangeDate} />
          </div>
          <Divider />
          <Button
            disabled
            size="small"
            onClick={createBackTestData}
            style={{ marginTop: '20px' }}
          >
            Create backtest
          </Button>

          <Divider />
          <Button
            size="small"
            onClick={handleTest}
            style={{ marginTop: '20px' }}
          >
            Test data from fireant vs supabase
          </Button>

          <Divider />
        </div>
        <div className="flex-1">
          {listUpdateStatus && listUpdateStatus.length && (
            <Table
              size="small"
              dataSource={listUpdateStatus}
              columns={columns}
              pagination={false}
            />
          )}
          <div>
            <div>Supabase</div>
            <div>{dataFromSupabase.dataSource?.length}</div>
            <div>{dataFromSupabase.fullDataSource?.length}</div>
            <div>Fireant</div>
            <div>{dataFromFireant.dataSource?.length}</div>
            <div>{dataFromFireant.fullDataSource?.length}</div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default Testing;
