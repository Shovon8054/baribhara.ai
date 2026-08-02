import { Link, Route, Routes } from 'react-router-dom';
// import DemoPage from './pages/DemoPage';
import HomePage from './pages/HomePage';
import SignIn from './pages/signin/SignIn';
import SignUp from './pages/signin/SignUp';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <Link to="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          BariBhara AI
        </Link>
        <Link to="/signin" className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400">
          Sign In
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/demo" element={<DemoPage />} /> */}
      </Routes>
    </div>
  )
}

export default App
