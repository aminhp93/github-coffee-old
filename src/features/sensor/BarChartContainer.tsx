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

const FAKE_DATA = JSON.parse(
  '[{"sensorId":1,"sensor":"Temperature","historicalData":[10,20,40,30,15],"value":15,"unit":"°C"},{"sensorId":4,"sensor":"Oxygen","historicalData":[75,105,65,95,90],"value":35,"unit":"%"},{"sensorId":2,"sensor":"Intensity","data":30,"historicalData":[1,3,20,40,50],"value":50,"unit":"g"},{"sensorId":3,"sensor":"Feeding","historicalData":[75,105,65,95,90],"value":35,"unit":"%"}]'
);

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
        const mappedData = mapData(FAKE_DATA);
        setOriginData(FAKE_DATA);
        setData(mappedData);
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
