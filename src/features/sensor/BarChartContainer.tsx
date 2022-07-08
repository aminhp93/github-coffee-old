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

export default function BarChartContainer() {
  const [data, setData] = useState([]);
  const [originData, setOriginData] = useState([]);

  const mapData = (data: any) => {
    const result: any = [];
    data.map((i: any, index: number) => {
      const item: any = {
        name: i.sensor,
        value: i.value,
      };

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

        const mappedData = mapData(res.data);
        setOriginData(res.data);
        setData(mappedData);
      } catch (e) {
        notification.error({ message: 'Error' });
      }
    };
    fetch();
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
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
