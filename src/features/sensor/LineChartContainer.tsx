import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import { notification } from 'antd';
import { INTERVAL_TIME_CALL_API, FAKE_DATA } from 'utils/sensor';
import { keyBy } from 'lodash';

const COLORS: any = {
  1: 'red',
  2: 'green',
  3: 'blue',
  4: 'yellow',
};

interface IProps {
  selectedSensor: any;
}

export default function LineChartContainer(props: IProps) {
  const { selectedSensor } = props;
  const [data, setData] = useState([]);
  const [originData, setOriginData] = useState([]);

  const mapData = (data: any) => {
    const result: any = [];
    const historicalData = data[0].historicalData;
    historicalData.map((i: any, index: number) => {
      const item: any = {
        name: `${index}`,
      };
      data.map((j: any, index2: number) => {
        item[j.sensor] = j.historicalData[index];
      });

      result.push(item);
    });
    return result;
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios({
          url: 'https://exam-express.vercel.app/api/sensors',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
          method: 'GET',
        });

        let filterData = res.data;
        if (selectedSensor) {
          filterData = res.data.filter(
            (i: any) => i.sensorId === selectedSensor.sensorId
          );
        }
        const mappedData = mapData(filterData);
        setOriginData(filterData);
        setData(mappedData);
      } catch (e) {
        let filterData = FAKE_DATA;
        if (selectedSensor) {
          filterData = FAKE_DATA.filter(
            (i: any) => i.sensorId === selectedSensor.sensorId
          );
        }
        const mappedData = mapData(filterData);
        setOriginData(filterData);
        setData(mappedData);

        notification.error({ message: 'Error' });
      }
    };
    fetch();
    const intervalId = setInterval(() => {
      fetch();
    }, INTERVAL_TIME_CALL_API);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />

        {originData.map((i: any, index) => {
          return (
            <Line
              type="monotone"
              dataKey={i.sensor}
              stroke={COLORS[index]}
              activeDot={{ r: 8 }}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}
