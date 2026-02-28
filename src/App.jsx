import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import TTS from './pages/TTS';
import STT from './pages/STT';
import Translate from './pages/Translate';
import Settings from './pages/Settings';
import Learn from './pages/Learn';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';
import { ROUTES, ANONYMOUS_PATHS } from './constants/routes';

function RootRoute() {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const path = location.pathname;

  if (!token) {
    if (path === ROUTES.DASHBOARD_INDEX) return <Landing />;
    if (ANONYMOUS_PATHS.includes(path)) {
      return (
        <Layout>
          <Outlet />
        </Layout>
      );
    }
    return <Navigate to={ROUTES.LANDING} replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function Layout({ children }) {
  return (
    <UserProvider>
      <Navbar />
      <main
        style={{
          padding: 'clamp(16px, 4vw, 24px)',
          maxWidth: 960,
          margin: '0 auto',
          minHeight: 'calc(100vh - 56px)',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>
    </UserProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<Signup />} />
      <Route path={ROUTES.LANDING} element={<Landing />} />
      <Route path={ROUTES.DASHBOARD_INDEX} element={<RootRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tts" element={<TTS />} />
        <Route path="stt" element={<STT />} />
        <Route path="translate" element={<Translate />} />
        <Route path="settings" element={<Settings />} />
        <Route path="learn" element={<Learn />} />
        <Route path="history" element={<History />} />
        <Route path="admin" element={<AdminDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
    </Routes>
  );
}
