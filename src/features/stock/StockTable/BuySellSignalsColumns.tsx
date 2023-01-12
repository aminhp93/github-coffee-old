import { Tooltip } from 'antd';
import { UNIT_BILLION, BUY_SELL_SIGNNAL_KEYS } from '../constants';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import InfoListBackTest from './InfoListBackTest';
import { Base, CustomSymbol } from '../types';

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
      sorter: (a: CustomSymbol, b: CustomSymbol) =>
        a.buySellSignals?.totalValue_last20_min -
        b.buySellSignals?.totalValue_last20_min,
      align: 'right',
      render: (data: CustomSymbol) => {
        const value = data.buySellSignals?.totalValue_last20_min || 0;
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
      sorter: (a: CustomSymbol, b: CustomSymbol) =>
        a.buySellSignals?.changePrice - b.buySellSignals?.changePrice,
      align: 'right',
      render: (data: CustomSymbol) => {
        const changePrice = data.buySellSignals?.changePrice || 0;
        const formattedChangePrice = Number(
          Number((changePrice * 100) / 1).toFixed(0)
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
      render: (data: CustomSymbol) => {
        const listBase = data.buySellSignals?.count_5_day_within_base || [];
        const buyIndex = listBase.length === 1 ? listBase[0].buyIndex : null;
        const className =
          listBase.length === BUY_SELL_SIGNNAL_KEYS.count_5_day_within_base
            ? 'green'
            : 'red';

        return (
          <Tooltip
            title={
              <div>
                {listBase.map((i: Base, index: number) => {
                  if (!i.buyIndex) return '';
                  return (
                    <div key={index}>
                      {/* {moment(i.fullData[i.buyIndex].date).format(DATE_FORMAT)} */}
                    </div>
                  );
                })}
              </div>
            }
          >
            <div className={className}>
              {listBase.length ===
              BUY_SELL_SIGNNAL_KEYS.count_5_day_within_base ? (
                <>
                  <CheckCircleOutlined style={{ marginRight: '4px' }} />
                  {buyIndex}
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
      sorter: (a: CustomSymbol, b: CustomSymbol) =>
        a.buySellSignals?.estimated_vol_change -
        b.buySellSignals?.estimated_vol_change,
      align: 'right',
      render: (data: CustomSymbol) => {
        const estimated_vol_change =
          data.buySellSignals?.estimated_vol_change || 0;
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
      sorter: (a: CustomSymbol, b: CustomSymbol) =>
        a.buySellSignals?.extra_vol - b.buySellSignals?.extra_vol,
      align: 'right',
      render: (data: CustomSymbol) => {
        const extra_vol = data.buySellSignals?.extra_vol || 0;
        return extra_vol.toFixed(0);
      },
    },

    {
      title: () => {
        return <Tooltip title={''}>{`_action`}</Tooltip>;
      },
      key: 'backtest',
      align: 'right',
      render: (data: CustomSymbol) => {
        let { buySellSignals, backtest, symbol } = data;

        return (
          <InfoListBackTest backTestData={backtest} symbol={symbol}>
            {buySellSignals?.action === 'buy' && (
              <div className="bg-green white" style={{ padding: '0px 8px' }}>
                {backtest?.winRate
                  ? `${backtest?.winRate} (${backtest?.winCount}/
                ${backtest?.filteredBase.length})`
                  : 'Buy'}
              </div>
            )}
            {buySellSignals?.action === 'sell' && (
              <div className="bg-red white" style={{ padding: '0px 8px' }}>
                Sell
              </div>
            )}
          </InfoListBackTest>
        );
      },
    },
  ];
};

export default BuySellSignalsColumns;
