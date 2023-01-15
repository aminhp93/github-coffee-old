import CustomEcharts from 'components/Echarts';
import Notification from 'components/firebaseNotifications/Notification';
import Layout from 'components/layout';
import Chat from 'features/chat';
import Example from 'features/example';
import Post from 'features/post';
import Snippet from 'features/snippet';
import Stock from 'features/stock';
import TaskManager from 'features/taskManager';
import Test from 'features/test';
import Work from 'features/work';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/context/FirebaseContext';

const Router = () => {
  const { authUser }: any = useAuth();
  console.log('authUser', authUser);
  return (
    <>
      <BrowserRouter>
        {authUser?.email ? (
          <Routes>
            <Route path="/" element={<Layout />}>
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
        ) : (
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="test" element={<Test />} />
              <Route
                path="*"
                element={
                  <main style={{ padding: '1rem' }}>
                    <p>There's nothing here!</p>
                  </main>
                }
              />
              <Route path="/" element={<div>Hello</div>} />
            </Route>
          </Routes>
        )}
      </BrowserRouter>
      <Notification />
    </>
  );
};

export default Router;
