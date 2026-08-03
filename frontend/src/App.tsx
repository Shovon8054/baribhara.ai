import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignIn from './pages/signin/SignIn';
import SignUp from './pages/signin/SignUp';
import DemoPage from './pages/DemoPage';
import TenantNavbar from './navbar';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <TenantNavbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/demo" element={<DemoPage />} />
      </Routes>
    </div>
  );
};

export default App;
