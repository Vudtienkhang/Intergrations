import {UserContent} from './Contexts/UserContent.jsx';
import {ToastProvider} from './Contexts/ToastProvider.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import {Suspense} from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';
import routers from './routers/routers.js';
import {Spinner} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashBoardAdmin from './pages/DashBoardAdmin/DashBoardAdmin.jsx';

function App() {
  return (
    <>
      <UserContent>
        <ToastProvider>
          <Suspense fallback={<Spinner animation="border" />}>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/dashboard/*" element={<DashBoardAdmin />} />
              {routers.map(({path, Component: Comp}) => (
                <Route key={path} path={path} element={<Comp />} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ToastProvider>
      </UserContent>
    </>
  );
}

export default App;
