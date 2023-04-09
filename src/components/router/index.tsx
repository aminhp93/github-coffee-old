import { useAuth } from '@/context/SupabaseContext';
import Layout from 'components/layout';
import Work from 'features/work/Work';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Router = () => {
  const { authUser }: any = useAuth();
  console.log('authUser', authUser);

  const defaultElement = authUser?.email ? <Work /> : <div>Hello</div>;

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              path="*"
              element={
                <main style={{ padding: '1rem' }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
            <Route path="/" element={defaultElement} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
