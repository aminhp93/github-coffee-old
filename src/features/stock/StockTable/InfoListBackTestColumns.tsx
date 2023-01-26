import { Button } from 'antd';
import { AlignType } from 'rc-table/lib/interface';
import moment from 'moment';
import BackTestChart from './BackTestChart';
import { getDataChart, getSeriesMarkPoint } from '../utils';
import { BackTest, Base } from '../types';
import { DATE_FORMAT } from '../constants';

interface Props {
  backTestData: BackTest | null;
  handleClickRow: (record: Base) => void;
}

const InfoListBackTestColumns = ({ backTestData, handleClickRow }: Props) => {
  return [
    {
      title: 'buyDate',
      width: 100,
      render: (data: Base) => {
        if ((data.buyIndex !== 0 && !data.buyIndex) || !backTestData) return '';

        const buyDate = backTestData.fullData[data.buyIndex]?.date;
        return (
          <Button onClick={() => handleClickRow(data)}>
            {moment(buyDate).format(DATE_FORMAT)}
          </Button>
        );
      },
    },
    {
      title: 'change_t0_vol (%)',
      width: 100,
      align: 'right' as AlignType,
      sorter: (a: Base, b: Base) =>
        a.change_t0_vol && b.change_t0_vol
          ? a.change_t0_vol - b.change_t0_vol
          : 0,
      render: (data: Base) => {
        if (!data.change_t0_vol) return '';
        return data.change_t0_vol.toFixed(0);
      },
    },
    {
      title: 'change_t0 (%)',
      width: 100,
      align: 'right' as AlignType,
      sorter: (a: Base, b: Base) =>
        a.change_t0 && b.change_t0 ? a.change_t0 - b.change_t0 : 0,
      render: (data: Base) => {
        if (!data.change_t0) return '';
        return data.change_t0.toFixed(2);
      },
    },
    {
      title: 'num_high_vol_than_t0 (%)',
      width: 100,
      align: 'right' as AlignType,
      sorter: (a: Base, b: Base) =>
        a.num_high_vol_than_t0 && b.num_high_vol_than_t0
          ? a.num_high_vol_than_t0 - b.num_high_vol_than_t0
          : 0,
      render: (data: Base) => {
        return data.num_high_vol_than_t0;
      },
    },
    {
      title: 'base_percent (%)',
      width: 100,
      align: 'right' as AlignType,
      render: (data: Base) => {
        return data.base_percent.toFixed(0);
      },
    },
    {
      title: 'upper_base (%)',
      width: 100,
      align: 'right' as AlignType,
      render: (data: Base) => {
        if (!data.upperPercent) return;
        return data.upperPercent.toFixed(0) + '%';
      },
    },
    {
      title: 'lower_base (%)',
      width: 100,
      align: 'right' as AlignType,
      render: (data: Base) => {
        if (!data.lowerPercent) return;
        return data.lowerPercent.toFixed(0) + '%';
      },
    },
    {
      title: 't0_over_base_max (%)',
      width: 100,
      align: 'right' as AlignType,
      sorter: (a: Base, b: Base) => a?.t0_over_base_max - b?.t0_over_base_max,
      render: (data: Base) => {
        if (!data.t0_over_base_max) return;
        return data.t0_over_base_max.toFixed(0) + '%';
      },
    },

    {
      title: 'other',
      render: (data: Base) => {
        return '';
      },
    },
    {
      title: 'chart',
      width: 150,
      render: (data: Base) => {
        // get data in data.fullData from data.buyIndex to next 5 items
        if (!data.buyIndex || !backTestData) return '';
        const list = backTestData.fullData.slice(
          data.buyIndex - 3,
          data.buyIndex + 5
        );
        const buyItem = backTestData.fullData[data.buyIndex];
        const seriesMarkPoint = getSeriesMarkPoint({ buyItem });
        const dataChart = getDataChart({
          data: list,
          seriesMarkPoint,
        });
        return (
          <div style={{ width: '150px', height: '50px' }}>
            <BackTestChart data={dataChart as any} />
          </div>
        );
      },
    },
    {
      title: 'change_t3 (%)',
      width: 100,
      align: 'right' as AlignType,
      sorter: (a: Base, b: Base) =>
        a.change_t3 && b.change_t3 ? a.change_t3 - b.change_t3 : 0,
      render: (data: Base) => {
        if (!data.change_t3) return '';
        return data.change_t3.toFixed(2);
      },
    },
  ];
};

export default InfoListBackTestColumns;
