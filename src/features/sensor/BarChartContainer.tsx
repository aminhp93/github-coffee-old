import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
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
import { ISensor } from 'types';

interface IProps {
  selectedSensor: any;
}

export default function BarChartContainer(props: IProps) {
  const { selectedSensor } = props;
  const [data, setData] = useState([]);
  const [originData, setOriginData] = useState([]);

  const mapData = (data: ISensor[]) => {
    const result: any = [];
    const historicalData = data[0].historicalData;
    historicalData.map((i: any, index: number) => {
      const item: any = {
        name: `${index}`,
      };
      data.map((j: ISensor, index2: number) => {
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
            (i: ISensor) => i.sensorId === selectedSensor.sensorId
          );
        }
        const mappedData = mapData(filterData);
        setOriginData(filterData);
        setData(mappedData);
      } catch (e) {
        let filterData = FAKE_DATA;
        if (selectedSensor) {
          filterData = FAKE_DATA.filter(
            (i: ISensor) => i.sensorId === selectedSensor.sensorId
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
      <BarChart
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
          return <Bar dataKey={i.sensor} fill="#8884d8" />;
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
