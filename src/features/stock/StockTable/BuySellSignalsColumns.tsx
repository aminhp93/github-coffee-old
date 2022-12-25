import React from 'react';
import { Tooltip, Button, Drawer, Table } from 'antd';
import { UNIT_BILLION, BUY_SELL_SIGNNAL_KEYS, DATE_FORMAT } from '../constants';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import BackTestChart from './BackTestChart';

const BuySellSignalsColumns = () => {
  return [
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
          value < BUY_SELL_SIGNNAL_KEYS.totalValue_last20_min ? 'red' : 'blur';
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
                  {`Value > ${BUY_SELL_SIGNNAL_KEYS.changePrice_buy}`}
                </div>
                <div>
                  <CloseCircleOutlined style={{ color: 'red' }} />{' '}
                  {`Value < ${BUY_SELL_SIGNNAL_KEYS.changePrice_buy}`}
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
        let className = 'blur';
        if (changePrice * 100 > BUY_SELL_SIGNNAL_KEYS.changePrice_buy) {
          className = 'green';
        } else if (changePrice * 100 < BUY_SELL_SIGNNAL_KEYS.changePrice_sell) {
          className = 'red';
        }

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
        const list_base =
          (data.count_5_day_within_base &&
            data.count_5_day_within_base.list_base) ||
          [];

        const index_base = list_base.length === 1 ? list_base[0].index : null;

        const className =
          list_base.length === BUY_SELL_SIGNNAL_KEYS.count_5_day_within_base
            ? 'green'
            : 'red';
        return (
          <Tooltip
            title={
              <div>
                {list_base.map((i: any) => {
                  return (
                    <div key={i.date}>
                      {moment(i.date).format('DD/MM/YYYY')}
                    </div>
                  );
                })}
              </div>
            }
          >
            <div className={className}>
              {list_base.length ===
              BUY_SELL_SIGNNAL_KEYS.count_5_day_within_base ? (
                <>
                  <CheckCircleOutlined style={{ marginRight: '4px' }} />
                  {index_base}
                </>
              ) : (
                <CloseCircleOutlined />
              )}
            </div>
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
                <div>{`'No. valid days within 10 day base`}</div>
                <div>
                  <CheckCircleOutlined style={{ color: 'green' }} />{' '}
                  {`Value = ${BUY_SELL_SIGNNAL_KEYS.count_10_day_within_base}`}
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
        const list_base =
          (data.count_10_day_within_base &&
            data.count_10_day_within_base.list_base) ||
          [];

        const index_base = list_base.length === 1 ? list_base[0].index : null;

        const className =
          list_base.length === BUY_SELL_SIGNNAL_KEYS.count_10_day_within_base
            ? 'green'
            : 'red';
        return (
          <Tooltip
            title={
              <div>
                {list_base.map((i: any) => {
                  return (
                    <div key={i.date}>
                      {moment(i.date).format('DD/MM/YYYY')}
                    </div>
                  );
                })}
              </div>
            }
          >
            <div className={className}>
              {list_base.length ===
              BUY_SELL_SIGNNAL_KEYS.count_10_day_within_base ? (
                <>
                  <CheckCircleOutlined style={{ marginRight: '4px' }} />
                  {index_base}
                </>
              ) : (
                <CloseCircleOutlined />
              )}
            </div>
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
          (data.last_10_day_summary && data.last_10_day_summary.strong_buy) ||
          [];
        const className =
          strong_buy.length >= BUY_SELL_SIGNNAL_KEYS.count_10_day_buy
            ? 'green'
            : 'blur';
        return (
          <Tooltip
            title={
              <div className="green" style={{ width: '100px' }}>
                {strong_buy.map((i: any) => {
                  return (
                    <div key={i.date}>
                      {moment(i.date).format('YYYY-MM-DD')}
                    </div>
                  );
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
                  return (
                    <div key={i.date}>
                      {moment(i.date).format('YYYY-MM-DD')}
                    </div>
                  );
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
      sorter: (a: any, b: any) =>
        a.estimated_vol_change - b.estimated_vol_change,
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
            {`_extra_vol(%)`}
          </Tooltip>
        );
      },
      sorter: (a: any, b: any) => a.extra_vol - b.extra_vol,
      align: 'right',
      render: (data: any) => {
        const extra_vol = data.extra_vol || 0;

        return <span className={''}>{extra_vol.toFixed(0)}</span>;
      },
    },

    {
      title: () => {
        return (
          <Tooltip
            title={
              <div>
                <div>{`Estimated volume in day compared to last 5`}</div>
              </div>
            }
          >
            {`_action`}
          </Tooltip>
        );
      },
      sorter: (a: any, b: any) => a.extra_vol - b.extra_vol,
      align: 'right',
      render: (data: any) => {
        let action = data.action;

        return (
          <div
            className={'flex width-100'}
            style={{ justifyContent: 'center' }}
          >
            {action === 'buy' && (
              <div className="bg-green white" style={{ padding: '0px 8px' }}>
                Buy: {data?.backtest?.winRate} ({data?.backtest?.winCount}/
                {data?.backtest?.list_base.length})
              </div>
            )}
            {action === 'sell' && (
              <div className="bg-red white" style={{ padding: '0px 8px' }}>
                Sell
              </div>
            )}

            {data?.backtest?.list_base.length > 0 && (
              <InfoListBackTest backTestData={data?.backtest} />
            )}
          </div>
        );
      },
    },
  ];
};

export default BuySellSignalsColumns;

interface InfoListBackTestProp {
  backTestData: {
    winRate: number;
    winCount: number;
    list_base: any[];
  };
}

const InfoListBackTest = ({ backTestData }: InfoListBackTestProp) => {
  const [open, setOpen] = React.useState(false);
  console.log(backTestData);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: 'buyDate',
      render: (data: any) => {
        const list = data.list || [];
        if (!list.length) return null;

        const buyDate = list[0].date;

        return moment(buyDate).format('YYYY-MM-DD');
      },
    },
    {
      title: 'estimated_vol_change',

      render: (data: any) => {
        return data.estimated_vol_change.toFixed(2);
      },
    },
    {
      title: 'result',
      render: (data: any) => {
        return data.result.toFixed(2);
      },
    },
    {
      title: 'chart',
      render: (data: any) => {
        console.log(data.list);
        const list = data.list || [];
        const dates: any = list.map((i: any) =>
          moment(i.date).format(DATE_FORMAT)
        );
        const prices: any = list.map((i: any) => [
          i.priceOpen,
          i.priceClose,
          i.priceLow,
          i.priceHigh,
          i.totalVolume,
        ]);
        const volumes: any = list.map((i: any) => i.totalVolume);

        return (
          <BackTestChart dates={dates} prices={prices} volumes={volumes} />
        );
      },
    },
  ];

  return (
    <>
      <Button
        size="small"
        type="primary"
        onClick={showDrawer}
        icon={<InfoCircleOutlined />}
      />

      <Drawer
        title="Basic Drawer"
        placement="right"
        width={800}
        onClose={onClose}
        open={open}
      >
        <Table
          dataSource={backTestData.list_base}
          columns={columns}
          bordered
          size="small"
          pagination={false}
        />
      </Drawer>
    </>
  );
};
