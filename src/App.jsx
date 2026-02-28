import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import TTS from './pages/TTS';
import STT from './pages/STT';
import Translate from './pages/Translate';
import Settings from './pages/Settings';
import Learn from './pages/Learn';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';
import { ROUTES, ANONYMOUS_PATHS } from './constants/routes';

function RedirectRoot() {
  const token = localStorage.getItem('token');
  return <Navigate to={token ? ROUTES.TTS : ROUTES.LANDING} replace />;
}

function RootRoute() {
  const token = localStorage.getItem('token');
  const { pathname } = useLocation();

  if (!token) {
    if (pathname === '/') return <Navigate to={ROUTES.LANDING} replace />;
    if (ANONYMOUS_PATHS.includes(pathname)) {
      return (
        <Layout showSidebar={false}>
          <Outlet />
        </Layout>
      );
    }
    return <Navigate to={ROUTES.LANDING} replace />;
  }

  return (
    <Layout showSidebar={true}>
      <Outlet />
    </Layout>
  );
}

function Layout({ children, showSidebar }) {
  return (
    <UserProvider>
      <Topbar />
      <div className="flex min-h-screen pt-14" style={{ backgroundColor: 'var(--color-bg)' }}>
        {showSidebar && <Sidebar />}
        <main
          className="flex-1 px-5 pb-24 pt-6 md:px-12 md:pb-12"
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </main>
      </div>
      <MobileNav />
    </UserProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<Signup />} />
      <Route path={ROUTES.LANDING} element={<Landing />} />
      <Route path="/" element={<RootRoute />}>
        <Route index element={<RedirectRoot />} />
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
