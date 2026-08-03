import { Route, Routes } from 'react-router-dom';
import { Toaster } from "react-hot-toast";

import HomePage from './pages/HomePage';
import SignIn from './pages/signin/SignIn';
import SignUp from './pages/signin/SignUp';
// import DemoPage from './pages/DemoPage';
import Properties from './pages/property-listing/Properties';
import TenantNavbar from './navbar';
import { useLocation } from 'react-router-dom';

import CreateProperty from './pages/property-listing/CreateProperty';
import Profile from './pages/profile/Profile';

const App = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/' || location.pathname === '/signin' || location.pathname === '/signup';
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
        {!hideNavbar && <TenantNavbar />}

        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-property" element={<CreateProperty />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/browse-properties" element={<Properties />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
