import { Route, Routes } from 'react-router-dom';
import { Toaster } from "react-hot-toast";

import HomePage from './pages/HomePage';
import SignIn from './pages/signin/SignIn';
import SignUp from './pages/signin/SignUp';
import DemoPage from './pages/DemoPage';
import TenantNavbar from './navbar';

const App = () => {
  return (
    <>
      {/* Toaster should be at the root level for proper positioning */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div className="min-h-screen bg-slate-950 text-white">
        <TenantNavbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/demo" element={<DemoPage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
