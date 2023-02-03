import { Button, Drawer, InputNumber, Radio } from 'antd';
import { useState } from 'react';
import { DEFAULT_FILTER, DELAY_TIME } from '../constants';
import './index.less';
import ReactMarkdown from 'react-markdown';
import { Filter } from '../types';

interface Props {
  onChange: (data: Filter) => void;
  onClose: () => void;
}

const Filters = ({ onChange, onClose }: Props) => {
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [delay, setDelay] = useState<number>(DELAY_TIME);
  const [sourceData, setSourceData] = useState<'fireant' | 'supabase' | string>(
    localStorage.getItem('sourceData') || 'fireant'
  );

  const [values, setValues] = useState<Filter>(DEFAULT_FILTER);

  const handleClearFilter = () => {
    onChange(DEFAULT_FILTER);
    setValues(DEFAULT_FILTER);
  };

  const handleChange = (key: keyof Filter, value: string) => {
    const newValues = { ...values, [key]: value };
    setValues(newValues);
    onChange(newValues);
  };

  return (
    <Drawer
      title={
        <div
          className="width-100 flex"
          style={{ justifyContent: 'space-between' }}
        >
          <div>Filter</div>
          <div>
            <Button
              style={{ marginLeft: '8px' }}
              size="small"
              onClick={() => setPlaying(!isPlaying)}
            >
              {isPlaying ? 'Stop Interval' : 'Start Interval'}
            </Button>
            <InputNumber
              size="small"
              style={{ marginLeft: '8px' }}
              disabled={isPlaying}
              value={delay}
              onChange={(value: any) => setDelay(value)}
            />
            <Button
              style={{ marginLeft: '8px' }}
              size="small"
              // onClick={() => onUpdateWatchlist()}
            >
              Update watchlist
            </Button>
          </div>
        </div>
      }
      placement="bottom"
      height="500px"
      className="StockTableFilterDrawer"
      onClose={onClose}
      open={true}
    >
      <div
        className="flex height-100"
        style={{ justifyContent: 'space-between' }}
      >
        <div className="flex flex-1" style={{ flexDirection: 'column' }}>
          <div style={{ marginTop: '20px' }}>
            <InputNumber
              size="small"
              addonBefore="change_t0"
              value={values['change_t0']}
              onChange={(value: any) => {
                handleChange('change_t0', value);
              }}
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            <InputNumber
              size="small"
              addonBefore="estimated_vol_change"
              value={values['estimated_vol_change']}
              onChange={(value: any) => {
                handleChange('estimated_vol_change', value);
              }}
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            <Radio.Group
              size="small"
              value={sourceData}
              onChange={(e: any) => {
                setSourceData(e.target.value);
                localStorage.setItem('sourceData', e.target.value);
              }}
            >
              <Radio.Button value="fireant">Fireant</Radio.Button>
              <Radio.Button value="supabase">Supabase</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div
          className="flex flex-1"
          style={{ justifyContent: 'space-between', flexDirection: 'column' }}
        >
          <div className="flex" style={{ justifyContent: 'space-between' }}>
            <div>
              <div>Description</div>
              <div>
                <ReactMarkdown
                  children={`
                - estimated_vol_change: 20
                - change_t0: 2
              `}
                />
              </div>
            </div>
          </div>

          <Button size="small" danger onClick={handleClearFilter}>
            Clear filter
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default Filters;
