import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import { GoogleOAuthProvider } from '@react-oauth/google';
import TaskDashboard from './components/TaskDashboard';
import MemberProgressPage from './components/MemberProgressPage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading…</span>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading…</span>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading…</span>
        </div>
      </div>
    );
  }
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const Landing = () => (
  <div className="min-h-screen relative overflow-hidden bg-slate-900">
    {/* Decorative gradient blobs */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
    </div>

    {/* Nav */}
    <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <span className="text-white font-semibold text-lg tracking-tight">TaskFlow</span>
      </div>
      <div className="flex items-center gap-3">
        <a href="/login" className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white transition">Sign In</a>
        <a href="/register" className="px-4 py-2 text-sm font-medium text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition">Get Started</a>
      </div>
    </header>

    {/* Hero */}
    <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32 sm:pt-32 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-medium text-slate-300">Role-based access · Secure JWT auth</span>
      </div>

      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight max-w-4xl leading-tight">
        Organize your work,
        <br />
        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          accomplish more
        </span>
      </h1>

      <p className="mt-6 max-w-xl text-lg text-slate-300 leading-relaxed">
        A clean, modern task management system with role-based access control. Create, assign, and track tasks with your team — effortlessly.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <a href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          Sign In
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
        <a href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition">
          Create Account
        </a>
      </div>

      {/* Feature pills */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
        {[
          { title: 'Task CRUD', desc: 'Create, edit, and track tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
          { title: 'Role-Based Access', desc: 'Admins see all, users see own', icon: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19 21v-2a4 4 0 00-3-3.87M5 21v-2a4 4 0 013-3.87m6-2a4 4 0 110-8 4 4 0 010 8z' },
          { title: 'Priority & Status', desc: 'Track what matters most', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        ].map((f) => (
          <div key={f.title} className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-left hover:bg-white/10 transition">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/10 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-sm">{f.title}</h3>
            <p className="text-slate-400 text-xs mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><TaskDashboard /></ProtectedRoute>} />
      <Route path="/admin/members" element={<AdminRoute><MemberProgressPage /></AdminRoute>} />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
    </Routes>
  );
};

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const App = () => (
  <GoogleOAuthProvider clientId={googleClientId}>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </GoogleOAuthProvider>
);

export default App;
