import { Route, Routes } from 'react-router-dom';
import { Toaster } from "react-hot-toast";

import HomePage from './pages/HomePage';
import SignIn from './pages/signin/SignIn';
import SignUp from './pages/signin/SignUp';
// import DemoPage from './pages/DemoPage';
import Properties from './pages/property-listing/Properties';
import { TenantNavbar, AdminNavbar } from './navbar';
import { useLocation } from 'react-router-dom';

import CreateProperty from './pages/property-listing/CreateProperty';
import Profile from './pages/profile/Profile';
import EditProfile from "./pages/profile/EditProfile";

import ViewProperty from './pages/property-listing/ViewProperty';
import Favorites from './pages/favoriteAndCompare/Favorite';
import AISearchPage from './pages/AISearchPage';

import Subscription from "./pages/subscription/SubscriptionPage";

import ChatList from "./pages/chat/ChatList";
import ChatPage from "./pages/chat/ChatPage";
import SubscriptionPage from './pages/subscription/SubscriptionPage';

// admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProperties from "./pages/admin/AdminProperties";


const App = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/' || location.pathname === '/signin' || location.pathname === '/signup';

  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/admin-dashboard';

  let userRole = null;
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      userRole = JSON.parse(storedUser)?.role;
    } catch { }
  }

  const showAdminNavbar = isAdminRoute || userRole === "ADMIN";

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
        {!hideNavbar && (showAdminNavbar ? <AdminNavbar /> : <TenantNavbar />)}

        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-property" element={<CreateProperty />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />


          <Route
            path="/subscription"
            element={<SubscriptionPage />}
          />



          <Route path="/view-property/:id" element={<ViewProperty />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/ai-search" element={<AISearchPage />} />

          <Route
            path="/chat"
            element={<ChatList />}
          />

          <Route
            path="/chat/:userId"
            element={<ChatPage />}
          />

          {/* admin section */}
          <Route
            path="/admin-dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />

          <Route
            path="/admin/properties"
            element={<AdminProperties />}
          />
          {/* <Route path="/browse-properties" element={<BrowseProperties />} /> */}
        </Routes>
      </div>
    </>
  );
};

export default App;
