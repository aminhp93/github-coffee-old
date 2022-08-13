import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomGridLayout from 'components/CustomGridLayout';

export interface DashboardProps {}

export default function Dashboard(props: DashboardProps) {
  let navigate = useNavigate();
  const layout = [
    { i: 'note', x: 0, y: 0, w: 3, h: 1, label: 'Note', linkTo: '/note' },
    {
      i: 'bashProfile',
      x: 3,
      y: 0,
      w: 3,
      h: 1,
      label: 'Bash profile',
      linkTo: '/bash-profile',
    },
    { i: 'demo', x: 6, y: 0, w: 3, h: 1, label: 'demo', linkTo: '/demo' },
    { i: 'test', x: 9, y: 0, w: 3, h: 1, label: 'test', linkTo: '/test' },
    { i: 'api', x: 0, y: 1, w: 3, h: 1, label: 'api', linkTo: '/api' },
    { i: 'chat', x: 3, y: 1, w: 3, h: 1, label: 'chat', linkTo: '/chat' },
    { i: 'stock', x: 6, y: 1, w: 3, h: 1, label: 'stock', linkTo: '/stock' },
    {
      i: 'echarts',
      x: 9,
      y: 1,
      w: 3,
      h: 1,
      label: 'echarts',
      linkTo: '/echarts',
    },
    { i: 'post', x: 0, y: 2, w: 3, h: 1, label: 'post', linkTo: '/post' },
    { i: 'user', x: 3, y: 2, w: 3, h: 1, label: 'user', linkTo: '/user' },
    {
      i: 'coworking',
      x: 6,
      y: 2,
      w: 3,
      h: 1,
      label: 'coworking',
      linkTo: '/coworking',
    },
  ];

  const handleCb = (data: any) => {
    navigate(data.linkTo);
  };

  return (
    <div>
      <CustomGridLayout layout={layout} cb={handleCb} />
    </div>
  );
}
