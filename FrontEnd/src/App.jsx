import { UserContent } from './Contexts/UserContent.jsx';
import { ToastProvider } from './Contexts/ToastProvider.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import routers from '@routers/routers.js'; 
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <UserContent>
      <ToastProvider>
        <Suspense
          fallback={
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
              <Spinner animation="border" role="status" />
            </div>
          }
        >
          <Routes>
            {/* Định nghĩa route cho LoginPage */}
            <Route path='/' element={<LoginPage />} />
            
            {/* Duyệt qua routers và tạo route cho mỗi trang */}
            {routers.map((item, index) => (
              <Route
                key={index}
                path={item.path}
                element={
                  <Suspense fallback={<Spinner animation="border" />}>
                    <item.Component />
                  </Suspense>
                }
              />
            ))}
          </Routes>
        </Suspense>
      </ToastProvider>
    </UserContent>
  );
}

export default App;
