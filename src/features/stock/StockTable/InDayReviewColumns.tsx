import { Table, Tooltip } from 'antd';
import { BUY_SELL_SIGNNAL_KEYS } from '../constants';

const InDayReviewColumns = [
  {
    title: '<100tr',
    render: (data: any) => {
      const transaction_summary = data.transaction_summary || [];
      const columns = [
        {
          title: '_filter_1',
          dataIndex: '_filter_1',
          key: '_filter_1',
          align: 'right' as 'right',
          width: 100,
        },
      ];
      return (
        <Table
          dataSource={transaction_summary}
          columns={columns}
          size={'small'}
          pagination={false}
          showHeader={false}
          bordered
          rowClassName={(record: any, index) => {
            if (index === 0) {
              return 'green';
            } else {
              return 'red';
            }
          }}
        />
      );
    },
  },
  {
    title: '<500tr',
    render: (data: any) => {
      const transaction_summary = data.transaction_summary || [];
      const columns = [
        {
          title: '_filter_2',
          dataIndex: '_filter_2',
          key: '_filter_2',
          align: 'right' as 'right',
          width: 100,
        },
      ];
      return (
        <Table
          dataSource={transaction_summary}
          columns={columns}
          size={'small'}
          pagination={false}
          showHeader={false}
          bordered
          rowClassName={(record: any, index) => {
            if (index === 0) {
              return 'green';
            } else {
              return 'red';
            }
          }}
        />
      );
    },
  },
  {
    title: '<1ty',
    render: (data: any) => {
      const transaction_summary = data.transaction_summary || [];
      const columns = [
        {
          title: '_filter_3',
          dataIndex: '_filter_3',
          key: '_filter_3',
          align: 'right' as 'right',
          width: 100,
        },
      ];
      return (
        <Table
          dataSource={transaction_summary}
          columns={columns}
          size={'small'}
          pagination={false}
          showHeader={false}
          bordered
          rowClassName={(record: any, index) => {
            if (index === 0) {
              return 'green';
            } else {
              return 'red';
            }
          }}
        />
      );
    },
  },
  {
    title: '<2ty',
    render: (data: any) => {
      const transaction_summary = data.transaction_summary || [];
      const columns = [
        {
          title: '_filter_4',
          dataIndex: '_filter_4',
          key: '_filter_4',
          align: 'right' as 'right',
          width: 100,
        },
      ];
      return (
        <Table
          dataSource={transaction_summary}
          columns={columns}
          size={'small'}
          pagination={false}
          showHeader={false}
          bordered
          rowClassName={(record: any, index) => {
            if (index === 0) {
              return 'green';
            } else {
              return 'red';
            }
          }}
        />
      );
    },
  },
  {
    title: '>2ty',
    render: (data: any) => {
      const transaction_summary = data.transaction_summary || [];
      const columns = [
        {
          title: '_filter_5',
          dataIndex: '_filter_5',
          key: '_filter_5',
          align: 'right' as 'right',
          width: 100,
        },
      ];
      return (
        <Table
          dataSource={transaction_summary}
          columns={columns}
          size={'small'}
          pagination={false}
          showHeader={false}
          bordered
          rowClassName={(record: any, index) => {
            if (index === 0) {
              return 'green';
            } else {
              return 'red';
            }
          }}
        />
      );
    },
  },
  {
    title: 'buy_sell_count',
    align: 'right',
    // sorter: (a: any, b: any) => a.buy_sell_vol - b.buy_sell_vol,
    render: (data: any) => {
      const buy_sell_count_ratio = data.buy_sell_vol?.buy_sell_count_ratio || 0;
      const buy_count = data.buy_sell_vol?.buy_count || 0;
      const sell_count = data.buy_sell_vol?.sell_count || 0;

      let className = 'blur';
      if (buy_sell_count_ratio >= BUY_SELL_SIGNNAL_KEYS.buy_sell_count__buy) {
        className = 'green';
      } else if (
        BUY_SELL_SIGNNAL_KEYS.buy_sell_count__sell >= buy_sell_count_ratio
      ) {
        className = 'red';
      }
      return (
        <Tooltip title={`${buy_count} / ${sell_count}`}>
          <div className={className}>{buy_sell_count_ratio}</div>
        </Tooltip>
      );
    },
  },
  {
    title: 'buy_sell_vol',
    align: 'right',
    // sorter: (a: any, b: any) => a.buy_sell_vol - b.buy_sell_vol,
    render: (data: any) => {
      const buy_sell_total_ratio = data.buy_sell_vol?.buy_sell_total_ratio || 0;
      const total_buy_vol = data.buy_sell_vol?.total_buy_vol || 0;
      const total_sell_vol = data.buy_sell_vol?.total_sell_vol || 0;
      let className = 'blur';
      if (buy_sell_total_ratio >= BUY_SELL_SIGNNAL_KEYS.buy_sell_vol__buy) {
        className = 'green';
      } else if (
        BUY_SELL_SIGNNAL_KEYS.buy_sell_vol__sell >= buy_sell_total_ratio
      ) {
        className = 'red';
      }
      return (
        <Tooltip title={`${total_buy_vol} / ${total_sell_vol}`}>
          <div className={className}>{buy_sell_total_ratio}</div>
        </Tooltip>
      );
    },
  },
];

export default InDayReviewColumns;
