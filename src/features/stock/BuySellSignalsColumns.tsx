import { Tooltip } from 'antd';
import { UNIT_BILLION, BUY_SELL_SIGNNAL_KEYS } from './constants';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './StockTable.less';
import moment from 'moment';

const BuySellSignalsColumns: any = [
  {
    title: () => {
      return (
        <Tooltip
          title={
            <div>
              <div>{`Lowest total value in last 20`}</div>
              <div>
                <CheckCircleOutlined style={{ color: 'green' }} />{' '}
                {`Value > ${BUY_SELL_SIGNNAL_KEYS.totalValue_last20_min}`}
              </div>
              <div>
                <CloseCircleOutlined style={{ color: 'red' }} />{' '}
                {`Value < ${BUY_SELL_SIGNNAL_KEYS.totalValue_last20_min}`}
              </div>
            </div>
          }
        >{`_min_total`}</Tooltip>
      );
    },
    sorter: (a: any, b: any) =>
      a.totalValue_last20_min - b.totalValue_last20_min,
    align: 'right',
    render: (data: any) => {
      const value = data.totalValue_last20_min || 0;
      const formattedValue = Number(
        Number(value / UNIT_BILLION).toFixed(0)
      ).toLocaleString();
      const className =
        value > BUY_SELL_SIGNNAL_KEYS.totalValue_last20_min ? 'green' : 'red';
      return <div className={className}>{formattedValue}</div>;
    },
  },
  {
    title: () => {
      return (
        <Tooltip
          title={
            <div>
              <div>{`Price change`}</div>
              <div>
                <CheckCircleOutlined style={{ color: 'green' }} />{' '}
                {`Value > ${BUY_SELL_SIGNNAL_KEYS.changePrice}`}
              </div>
              <div>
                <CloseCircleOutlined style={{ color: 'red' }} />{' '}
                {`Value < ${BUY_SELL_SIGNNAL_KEYS.changePrice}`}
              </div>
            </div>
          }
        >{`_%_price`}</Tooltip>
      );
    },
    sorter: (a: any, b: any) => a.changePrice - b.changePrice,
    align: 'right',
    render: (data: any) => {
      const changePrice = data.changePrice || 0;
      const formattedChangePrice = Number(
        Number((changePrice * 100) / 1).toFixed(2)
      ).toLocaleString();
      const className =
        changePrice * 100 > BUY_SELL_SIGNNAL_KEYS.changePrice ? 'green' : 'red';
      return <div className={className}>{formattedChangePrice}</div>;
    },
  },
  {
    title: () => {
      return (
        <Tooltip
          title={
            <div>
              <div>{`'No. valid days within 5 day base`}</div>
              <div>
                <CheckCircleOutlined style={{ color: 'green' }} />{' '}
                {`Value = ${BUY_SELL_SIGNNAL_KEYS.count_5_day_within_base}`}
              </div>
              <div>
                <CloseCircleOutlined style={{ color: 'red' }} />{' '}
                {`Value < ${BUY_SELL_SIGNNAL_KEYS.count_5_day_within_base}`}
              </div>
            </div>
          }
        >{`_5_day_base`}</Tooltip>
      );
    },
    align: 'right',
    render: (data: any) => {
      const count =
        (data.count_5_day_within_base && data.count_5_day_within_base.count) ||
        0;
      const className =
        count === BUY_SELL_SIGNNAL_KEYS.count_5_day_within_base
          ? 'green'
          : 'red';
      return <div className={className}>{count}</div>;
    },
  },
  {
    title: () => {
      return (
        <Tooltip
          title={
            <div>
              <div>{`'No. valid days within 10 day base`}</div>
              <div>
                <CheckCircleOutlined style={{ color: 'green' }} />{' '}
                {`Value > ${BUY_SELL_SIGNNAL_KEYS.count_10_day_within_base}`}
              </div>
              <div>
                <CloseCircleOutlined style={{ color: 'red' }} />{' '}
                {`Value < ${BUY_SELL_SIGNNAL_KEYS.count_10_day_within_base}`}
              </div>
            </div>
          }
        >{`_10_day_base`}</Tooltip>
      );
    },
    align: 'right',
    render: (data: any) => {
      const count =
        (data.count_10_day_within_base &&
          data.count_10_day_within_base.count) ||
        0;
      const className =
        count === BUY_SELL_SIGNNAL_KEYS.count_10_day_within_base
          ? 'green'
          : 'red';
      return <div className={className}>{count}</div>;
    },
  },
  {
    title: () => {
      return (
        <Tooltip
          title={
            <div>
              <div>{`Count number of day have strong buy`}</div>
              <div>{`vol: dealVolume > averageVolume_last10`}</div>
              <div>{`priceClose > last_price * 1.03 ||
        (lowerHammer > 3 && upperHammer < 1) --> isBuy`}</div>
              <div>
                <CheckCircleOutlined style={{ color: 'green' }} />{' '}
                {`Value > ${BUY_SELL_SIGNNAL_KEYS.count_10_day_buy}`}
              </div>
            </div>
          }
        >
          {`_10_day_buy`}
        </Tooltip>
      );
    },
    align: 'right',
    render: (data: any) => {
      const strong_buy =
        (data.last_10_day_summary && data.last_10_day_summary.strong_buy) || [];
      const className =
        strong_buy.length >= BUY_SELL_SIGNNAL_KEYS.count_10_day_buy
          ? 'green'
          : 'blur';
      return (
        <Tooltip
          title={
            <div className="green" style={{ width: '100px' }}>
              {strong_buy.map((i: any) => {
                return <div>{moment(i.date).format('YYYY-MM-DD')}</div>;
              })}
            </div>
          }
        >
          <div className={className}>{strong_buy.length}</div>
        </Tooltip>
      );
    },
  },
  {
    title: () => {
      return (
        <Tooltip
          title={
            <div>
              <div>{`Count number of day have strong sell`}</div>
              <div>{`vol: dealVolume > averageVolume_last10`}</div>
              <div>{`priceClose < last_price * 0.97 ||
        (upperHammer > 3 && lowerHammer < 1) --> isSell`}</div>
              <div>
                <CloseCircleOutlined style={{ color: 'red' }} />{' '}
                {`Value < ${BUY_SELL_SIGNNAL_KEYS.count_10_day_sell}`}
              </div>
            </div>
          }
        >
          {`_10_day_sell`}
        </Tooltip>
      );
    },
    align: 'right',
    render: (data: any) => {
      const strong_sell =
        (data.last_10_day_summary && data.last_10_day_summary.strong_sell) ||
        [];
      const className =
        strong_sell.length >= BUY_SELL_SIGNNAL_KEYS.count_10_day_sell
          ? 'red'
          : 'blur';
      return (
        <Tooltip
          title={
            <div className="red" style={{ width: '100px' }}>
              {strong_sell.map((i: any) => {
                return <div>{moment(i.date).format('YYYY-MM-DD')}</div>;
              })}
            </div>
          }
        >
          <div className={className}>{strong_sell.length}</div>
        </Tooltip>
      );
    },
  },
  {
    title: () => {
      return (
        <Tooltip
          title={
            <div>
              <div>{`Estimated volume in day compared to last 5`}</div>
              <div>
                <CloseCircleOutlined style={{ color: 'red' }} />{' '}
                {`Value < ${BUY_SELL_SIGNNAL_KEYS.count_10_day_sell}`}
              </div>
            </div>
          }
        >
          {`_est_vol(%)`}
        </Tooltip>
      );
    },
    sorter: (a: any, b: any) => a.estimated_vol_change - b.estimated_vol_change,
    align: 'right',
    render: (data: any) => {
      const estimated_vol_change = data.estimated_vol_change || 0;
      const className =
        estimated_vol_change > BUY_SELL_SIGNNAL_KEYS.estimated_vol_change
          ? 'green'
          : 'blur';

      return (
        <span className={className}>{estimated_vol_change.toFixed(0)}</span>
      );
    },
  },
];

export default BuySellSignalsColumns;
