import { Button, Tooltip } from 'antd';
import { AlignType } from 'rc-table/lib/interface';
import moment from 'moment';
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
        if (
          (data.startBaseIndex !== 0 && !data.startBaseIndex) ||
          !backTestData
        )
          return '';

        const buyDate = backTestData.fullData[data.startBaseIndex]?.date;
        return (
          <Button size="small" onClick={() => handleClickRow(data)}>
            {moment(buyDate).format(DATE_FORMAT)}
          </Button>
        );
      },
    },
    {
      title: 't0_vol',
      width: 80,
      align: 'right' as AlignType,
      sorter: (a: Base, b: Base) =>
        a.change_t0_vol && b.change_t0_vol
          ? a.change_t0_vol - b.change_t0_vol
          : 0,
      render: (data: Base) => {
        if (!data.change_t0_vol) return '';
        return data.change_t0_vol.toFixed(0) + '%';
      },
    },
    {
      title: 't0',
      width: 80,
      align: 'right' as AlignType,
      sorter: (a: Base, b: Base) =>
        a.change_t0 && b.change_t0 ? a.change_t0 - b.change_t0 : 0,
      render: (data: Base) => {
        if (!data.change_t0) return '';
        return data.change_t0.toFixed(1) + '%';
      },
    },
    {
      title: () => {
        return (
          <Tooltip title="num high vol than t0">
            <div>high_vol</div>
          </Tooltip>
        );
      },

      width: 80,
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
      title: 'base_count',
      width: 80,
      align: 'right' as AlignType,
      render: (data: Base) => {
        return data.endBaseIndex - data.startBaseIndex;
      },
    },
    {
      title: 'base_percent',
      width: 80,
      align: 'right' as AlignType,
      render: (data: Base) => {
        return data.base_percent.toFixed(0) + '%';
      },
    },
    {
      title: 'upper_base',
      width: 80,
      align: 'right' as AlignType,
      render: (data: Base) => {
        if (!data.upperPercent) return;
        return data.upperPercent.toFixed(0) + '%';
      },
    },
    {
      title: 'lower_base',
      width: 80,
      align: 'right' as AlignType,
      render: (data: Base) => {
        if (!data.lowerPercent) return;
        return data.lowerPercent.toFixed(0) + '%';
      },
    },
    {
      title: 't0_over_base_max',
      width: 80,
      align: 'right' as AlignType,
      // sorter: (a: Base, b: Base) => a?.t0_over_base_max - b?.t0_over_base_max,
      // render: (data: Base) => {
      //   if (!data.t0_over_base_max) return;
      //   return data.t0_over_base_max.toFixed(0) + '%';
      // },
    },
    {
      title: 'max',
      width: 80,
      align: 'right' as AlignType,
      // sorter: (a: Base, b: Base) => a?.t0_over_base_max - b?.t0_over_base_max,
      render: (data: Base) => {
        if (
          !data.max_change_in_20_days ||
          !data.max_in_20_days_without_break_base_index
        )
          return;
        return (
          data.max_change_in_20_days.toFixed(0) +
          '%' +
          ' - ' +
          data.max_in_20_days_without_break_base_index
        );
      },
    },
    {
      title: 'min',
      width: 80,
      align: 'right' as AlignType,
      // sorter: (a: Base, b: Base) => a?.t0_over_base_min - b?.t0_over_base_min,
      render: (data: Base) => {
        if (
          !data.min_change_in_20_days ||
          !data.min_in_20_days_without_break_base_index
        )
          return;
        return (
          data.min_change_in_20_days.toFixed(0) +
          '%' +
          ' - ' +
          data.min_in_20_days_without_break_base_index
        );
      },
    },

    {
      title: 'other',
      render: (data: Base) => {
        return '';
      },
    },
    {
      title: 'change_t3',
      width: 80,
      align: 'right' as AlignType,
      sorter: (a: Base, b: Base) =>
        a.change_t3 && b.change_t3 ? a.change_t3 - b.change_t3 : 0,
      render: (data: Base) => {
        if (!data.change_t3) return '';
        return data.change_t3.toFixed(1) + '%';
      },
    },
  ];
};

export default InfoListBackTestColumns;
