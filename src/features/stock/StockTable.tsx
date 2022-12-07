import { StockService } from 'libs/services';
import React, { useState } from 'react';
import { keyBy } from 'lodash';
import { Watchlist } from 'libs/types';
import {
  Divider,
  RadioChangeEvent,
  Checkbox,
  Form,
  Radio,
  Switch,
  Table,
  Button,
  notification,
  Dropdown,
  Menu,
  Drawer,
  InputNumber,
} from 'antd';

import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type {
  ExpandableConfig,
  TableRowSelection,
} from 'antd/es/table/interface';
import { DATE_FORMAT } from './utils';
import moment from 'moment';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import {
  FundamentalKeys,
  HistoricalQuoteKeys,
  FinancialIndicatorsKeys,
  getHistorialQuote,
  getFinancialIndicator,
  getFundamentals,
  LIST_VN30,
} from './utils';
import axios from 'axios';

const HistoricalQuoteColumns = HistoricalQuoteKeys.map((i) => {
  if (i === 'date') {
    return {
      title: 'dateeeeeeeee',
      dataIndex: i,
      key: i,
      // width: 300,
      render: (text: string) => moment(text).format(DATE_FORMAT),
    };
  }
  return {
    title: i,
    dataIndex: i,
    key: i,
    align: 'right',
    sorter: (a: any, b: any) => a[i] - b[i],
    render: (data: any) => {
      if (typeof data === 'number') {
        if (data > 1_000) {
          return Number(data.toFixed(0)).toLocaleString();
        }
        return Number(data.toFixed(1)).toLocaleString();
      }
      return data;
    },
  };
});

const FundamentalColumns = FundamentalKeys.map((i) => {
  return {
    title: i,
    dataIndex: i,
    key: i,
    sorter: (a: any, b: any) => a[i] - b[i],
    align: 'right',
    render: (data: any) => {
      if (typeof data === 'number') {
        if (data > 1_000) {
          return Number(data.toFixed(0)).toLocaleString();
        }
        return Number(data.toFixed(1)).toLocaleString();
      }
      return data;
    },
  };
});

const FinancialIndicatorsColumns: any = FinancialIndicatorsKeys.map((i) => {
  return {
    // remove all whitespace
    title: i.replace(/\s/g, ''),
    dataIndex: i,
    key: i,
    sorter: (a: any, b: any) => a[i] - b[i],
    align: 'right',
    render: (data: any) => {
      if (typeof data === 'number') {
        if (data > 1_000) {
          return Number(data.toFixed(0)).toLocaleString();
        }
        return Number(data.toFixed(1)).toLocaleString();
      }
      return data;
    },
  };
});

const MyIndicatorsColumns: any = [
  {
    title: '_marketCap (ty)',
    sorter: (a: any, b: any) => a.marketCap - b.marketCap,
    align: 'right',
    render: (data: any) => {
      // divide by 1 billion
      return Number(
        Number(data.marketCap / 1_000_000_000).toFixed(0)
      ).toLocaleString();
    },
  },
  {
    title: '_min20Days_totalValue (ty)',
    sorter: (a: any, b: any) => a.min20Days_totalValue - b.min20Days_totalValue,
    align: 'right',
    render: (data: any) => {
      // divide by 1 billion
      return Number(
        Number(data.min20Days_totalValue / 1_000_000_000).toFixed(0)
      ).toLocaleString();
    },
  },
  {
    title: '_max20Days_totalValue (ty)',
    sorter: (a: any, b: any) => a.max20Days_totalValue - b.max20Days_totalValue,
    align: 'right',
    render: (data: any) => {
      // divide by 1 billion
      return Number(
        Number(data.max20Days_totalValue / 1_000_000_000).toFixed(0)
      ).toLocaleString();
    },
  },
];

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
  description: string;
}

type TablePaginationPosition =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight';

const defaultExpandable = {
  expandedRowRender: (record: DataType) => <p>{record.description}</p>,
};
const defaultTitle = () => 'Here is title';
// const defaultFooter = () => 'Here is footer';

const CheckboxGroup = Checkbox.Group;

const plainOptions = [
  'HistoricalQuote',
  'Fundamental',
  'FinancialIndicators',
  'MyIndicators',
];
const defaultCheckedList: any = [];

export default function StockTable() {
  const [openDrawer, setOpenDrawer] = useState(false);

  const [listWatchlist, setListWatchlist] = React.useState([]);
  const [currentWatchlist, setCurrentWatchlist] =
    React.useState<Watchlist | null>(null);

  const [dataSource, setDataSource] = React.useState([]);

  const listWatchlistObj = keyBy(listWatchlist, 'watchlistID');

  const [bordered, setBordered] = useState(true);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<SizeType>('small');
  const [expandable, setExpandable] = useState<
    ExpandableConfig<DataType> | undefined
  >(defaultExpandable);
  const [showTitle, setShowTitle] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showfooter, setShowFooter] = useState(true);
  const [rowSelection, setRowSelection] = useState<
    TableRowSelection<DataType> | undefined
  >({});
  const [hasData, setHasData] = useState(true);
  const [tableLayout, setTableLayout] = useState(undefined);
  const [top, setTop] = useState<TablePaginationPosition | 'none'>('none');
  const [bottom, setBottom] = useState<TablePaginationPosition>('bottomRight');
  const [ellipsis, setEllipsis] = useState(false);
  const [yScroll, setYScroll] = useState(false);
  const [xScroll, setXScroll] = useState<string | undefined>('scroll');
  const [columns, setColumns] = useState<ColumnsType<DataType>>([]);

  const [checkedList, setCheckedList] =
    useState<CheckboxValueType[]>(defaultCheckedList);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [min20Days_totalValue, setMin20Days_totalValue] = useState(5);
  const [max20Days_totalValue, setMax20Days_totalValue] = useState(null);
  const [excludeVN30, setExcludeVN30] = useState(true);

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
          symbol,
        };
      }
    );
    setDataSource(mapData);
  };

  const menu = (
    <Menu onClick={handleClickMenuWatchlist}>
      {listWatchlist.map((i: any) => {
        return (
          <Menu.Item disabled={i.name === 'all'} key={i.watchlistID}>
            {i.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const handleBorderChange = (enable: boolean) => {
    setBordered(enable);
  };

  const handleLoadingChange = (enable: boolean) => {
    setLoading(enable);
  };

  const handleSizeChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };

  const handleTableLayoutChange = (e: RadioChangeEvent) => {
    setTableLayout(e.target.value);
  };

  const handleExpandChange = (enable: boolean) => {
    setExpandable(enable ? defaultExpandable : undefined);
  };

  const handleEllipsisChange = (enable: boolean) => {
    setEllipsis(enable);
  };

  const handleTitleChange = (enable: boolean) => {
    setShowTitle(enable);
  };

  const handleHeaderChange = (enable: boolean) => {
    setShowHeader(enable);
  };

  const handleFooterChange = (enable: boolean) => {
    setShowFooter(enable);
  };

  const handleRowSelectionChange = (enable: boolean) => {
    setRowSelection(enable ? {} : undefined);
  };

  const handleYScrollChange = (enable: boolean) => {
    setYScroll(enable);
  };

  const handleXScrollChange = (e: RadioChangeEvent) => {
    setXScroll(e.target.value);
  };

  const handleDataChange = (newHasData: boolean) => {
    setHasData(newHasData);
  };

  const scroll: { x?: number | string; y?: number | string } = {};
  if (yScroll) {
    scroll.y = 240;
  }
  if (xScroll) {
    scroll.x = '90vw';
  }

  const tableColumns: any = columns.map((item) => ({ ...item, ellipsis }));
  if (xScroll === 'fixed') {
    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = 'right';
  }

  const tableProps: TableProps<DataType> = {
    bordered,
    loading,
    size,
    expandable,
    title: showTitle ? defaultTitle : undefined,
    showHeader,
    footer: showfooter
      ? () => {
          return (
            <div className="flex" style={{ justifyContent: 'space-between' }}>
              <div>{String(dataSource.length)}</div>
              <Button type="primary" onClick={showDrawer}>
                Settings
              </Button>
            </div>
          );
        }
      : undefined,
    rowSelection,
    scroll,
    tableLayout,
  };

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  React.useEffect(() => {
    const columns: any = [
      {
        title: 'Symbol',
        dataIndex: 'symbol',
        key: 'symbol',
      },
    ];
    if (checkedList.includes('HistoricalQuote')) {
      columns.push({
        title: 'Historical Quotes',
        children: HistoricalQuoteColumns,
      });
    }

    if (checkedList.includes('Fundamental')) {
      columns.push({
        title: 'Fundamentals',
        children: FundamentalColumns,
      });
    }

    if (checkedList.includes('FinancialIndicators')) {
      columns.push({
        title: 'FinancialIndicators',
        children: FinancialIndicatorsColumns,
      });
    }

    if (checkedList.includes('MyIndicators')) {
      columns.push({
        title: 'MyIndicators',
        children: MyIndicatorsColumns,
      });
    }
    setColumns(columns);
  }, [checkedList]);

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const handleGetData = () => {
    const listPromises: any = [];

    dataSource.forEach((j: any) => {
      listPromises.push(getHistorialQuote(j.symbol));
      listPromises.push(getFundamentals(j.symbol));
      listPromises.push(getFinancialIndicator(j.symbol));
    });

    setLoading(true);
    Promise.all(listPromises).then((res: any) => {
      setLoading(false);
      let newDataSource: any = [...dataSource];
      newDataSource = newDataSource.map((i: any) => {
        const filterRes = res.filter((j: any) => j.symbol === i.symbol);
        let newItem = { ...i };
        if (filterRes.length > 0) {
          filterRes.forEach((j: any) => {
            newItem = { ...newItem, ...j };
          });
        }
        return newItem;
      });
      setDataSource(newDataSource);
      notification.success({ message: 'success' });
    });
  };

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  const handleFilter = () => {
    // filter dataSource with min of min20Days_totalValue is min20Days_totalValue
    const newDataSource = dataSource.filter((i: any) => {
      return (
        i.min20Days_totalValue >= min20Days_totalValue * 1_000_000_000 &&
        !LIST_VN30.includes(i.symbol)
      );
    });
    setDataSource(newDataSource);
  };
  console.log(dataSource);

  const handleUpdateWatchlist = () => {
    try {
      axios({
        method: 'PUT',
        url: `https://restv2.fireant.vn/me/watchlists/2279542`,
        headers: {
          authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNzE1ODY4LCJuYmYiOjE2MTM3MTU4NjgsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM3MTU4NjcsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiYzZmNmNkZWE2MTcxY2Q5NGRiNWZmOWZkNDIzOWM0OTYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.oZ8S_sTP6qVRJqY4h7g0JvXVPB0k8tm4go9pUFD0sS_sDZbC6zjelAVVNGHWJja82ewJbUEmTJrnDWAKR-rg5Pprp4DW7MzaN0lw3Bw0wEacphtyglx-H14-0Wnv_-2KMyQLP5EYH8wgyiw9I3ig_i7kHJy-XgCd__tdoMKvarkIXPzJJJY32gq-LScWb3HyZsfEdi-DEZUUzjAHR1nguY8oNmCiA6FaQCzOBU_qfgmOLWhN9ZNN1G3ODAeoOnphLJuWjHIrwPuVXy6B39eU2PtHmujtw_YOXdIWEi0lRhqV1pZOrJEarQqjdV3K5XNwpGvONT8lvUwUYGoOwwBFJg',
        },
        data: {
          name: 'thanh_khoan_vua_2',
          symbols: dataSource.map((i: any) => i.symbol),
          userName: 'minhpn.org.ec1@gmail.com',
          watchlistID: 2279542,
        },
      });

      notification.success({ message: 'Update wl success' });
    } catch (e) {
      notification.error({ message: 'Update wl success' });
    }
  };

  return (
    <div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Dropdown overlay={menu} trigger={['click']}>
            <div>{currentWatchlist?.name || 'Select watchlist'}</div>
          </Dropdown>
          <div>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              Check all
            </Checkbox>
            <Divider />
            <CheckboxGroup
              options={plainOptions}
              value={checkedList}
              onChange={onChange}
            />
          </div>
          <Button disabled={loading} onClick={handleGetData}>
            Get data
          </Button>
        </div>
        <div className="flex">
          <InputNumber
            addonBefore="min20Days_totalValue"
            value={min20Days_totalValue}
            onChange={(value: any) => setMin20Days_totalValue(value)}
          />
          <InputNumber
            addonBefore="max20Days_totalValue"
            value={max20Days_totalValue}
            onChange={(value: any) => setMax20Days_totalValue(value)}
          />
          <div>
            Exclude VN30
            <Switch
              checked={excludeVN30}
              onChange={() => setExcludeVN30(!excludeVN30)}
            />
          </div>
        </div>
        <Button onClick={handleFilter}>Filter</Button>
        <Button onClick={handleUpdateWatchlist}>Update watchlist</Button>

        <Table
          {...tableProps}
          pagination={{ position: [top as TablePaginationPosition, bottom] }}
          columns={columns}
          dataSource={hasData ? dataSource : []}
          scroll={scroll}
        />
      </div>

      <Drawer
        title="Settings"
        placement="bottom"
        onClose={onClose}
        open={openDrawer}
      >
        <div
          className="height-100"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
          }}
        >
          <Form
            layout="inline"
            className="components-table-demo-control-bar"
            style={{ marginBottom: 16 }}
          >
            <Form.Item label="Bordered">
              <Switch checked={bordered} onChange={handleBorderChange} />
            </Form.Item>
            <Form.Item label="loading">
              <Switch checked={loading} onChange={handleLoadingChange} />
            </Form.Item>
            <Form.Item label="Title">
              <Switch checked={showTitle} onChange={handleTitleChange} />
            </Form.Item>
            <Form.Item label="Column Header">
              <Switch checked={showHeader} onChange={handleHeaderChange} />
            </Form.Item>
            <Form.Item label="Footer">
              <Switch checked={showfooter} onChange={handleFooterChange} />
            </Form.Item>
            <Form.Item label="Expandable">
              <Switch checked={!!expandable} onChange={handleExpandChange} />
            </Form.Item>
            <Form.Item label="Checkbox">
              <Switch
                checked={!!rowSelection}
                onChange={handleRowSelectionChange}
              />
            </Form.Item>
            <Form.Item label="Fixed Header">
              <Switch checked={!!yScroll} onChange={handleYScrollChange} />
            </Form.Item>
            <Form.Item label="Has Data">
              <Switch checked={!!hasData} onChange={handleDataChange} />
            </Form.Item>
            <Form.Item label="Ellipsis">
              <Switch checked={!!ellipsis} onChange={handleEllipsisChange} />
            </Form.Item>
            <Form.Item label="Size">
              <Radio.Group value={size} onChange={handleSizeChange}>
                <Radio.Button value="large">Large</Radio.Button>
                <Radio.Button value="middle">Middle</Radio.Button>
                <Radio.Button value="small">Small</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Table Scroll">
              <Radio.Group value={xScroll} onChange={handleXScrollChange}>
                <Radio.Button value={undefined}>Unset</Radio.Button>
                <Radio.Button value="scroll">Scroll</Radio.Button>
                <Radio.Button value="fixed">Fixed Columns</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Table Layout">
              <Radio.Group
                value={tableLayout}
                onChange={handleTableLayoutChange}
              >
                <Radio.Button value={undefined}>Unset</Radio.Button>
                <Radio.Button value="fixed">Fixed</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Pagination Top">
              <Radio.Group
                value={top}
                onChange={(e) => {
                  setTop(e.target.value);
                }}
              >
                <Radio.Button value="topLeft">TopLeft</Radio.Button>
                <Radio.Button value="topCenter">TopCenter</Radio.Button>
                <Radio.Button value="topRight">TopRight</Radio.Button>
                <Radio.Button value="none">None</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Pagination Bottom">
              <Radio.Group
                value={bottom}
                onChange={(e) => {
                  setBottom(e.target.value);
                }}
              >
                <Radio.Button value="bottomLeft">BottomLeft</Radio.Button>
                <Radio.Button value="bottomCenter">BottomCenter</Radio.Button>
                <Radio.Button value="bottomRight">BottomRight</Radio.Button>
                <Radio.Button value="none">None</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </div>
  );
}
