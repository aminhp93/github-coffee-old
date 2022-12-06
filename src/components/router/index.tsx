import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import CustomEcharts from 'components/Echarts';
import Chat from 'features/chat';
import Example from 'features/example';
import Post from 'features/post';
import Snippet from 'features/snippet';
import Stock from 'features/stock';
import TaskManager from 'features/taskManager';
import Test from 'features/test';
import Work from 'features/work';
import Layout from 'components/layout';

const Router = () => {
  const protectedLayout = (
    <RequireAuth>
      <Layout />
    </RequireAuth>
  );
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={protectedLayout}>
          <Route path="work" element={<Work />} />
          <Route path="chat" element={<Chat />} />
          <Route path="echarts" element={<CustomEcharts />} />
          <Route path="example" element={<Example />} />
          <Route path="post" element={<Post />} />
          <Route path="taskManager" element={<TaskManager />} />
          <Route path="stock" element={<Stock />} />
          <Route path="test" element={<Test />} />
          <Route path="snippet" element={<Snippet />} />
          <Route
            path="*"
            element={
              <main style={{ padding: '1rem' }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
          <Route path="/" element={<Work />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
