import { Layout } from 'antd';
import React, { useEffect } from 'react';
import { Col, Divider, Row } from 'antd';
import GridLayout from 'react-grid-layout';
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
import '../../../node_modules/react-grid-layout/css/styles.css';
import '../../../node_modules/react-resizable/css/styles.css';
import axios from 'axios';

const { Header, Footer, Sider, Content } = Layout;

export interface ITestProps {}

export default function Test(props: ITestProps) {
  const layout = [
    { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
    { i: 'b', x: 1, y: 0, w: 6, h: 8, minW: 2, maxW: 6 },
    { i: 'c', x: 4, y: 0, w: 1, h: 2 },
  ];
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
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    };
    fetch();
  }, []);
  return (
    <div>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
      >
        <div style={{ background: 'green' }} key="a">
          a
        </div>
        <div style={{ background: 'lightblue' }} key="b">
          <Example />
        </div>
        <div style={{ background: 'gray' }} key="c">
          c
        </div>
      </GridLayout>
    </div>
  );
}

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

function Example() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
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
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
