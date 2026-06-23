/**
 * App Component
 * Root component with routing and auth protection.
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import TaskDashboard from './components/TaskDashboard';

/**
 * ProtectedRoute — redirects to /login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
};

/**
 * PublicRoute — redirects to /dashboard if already authenticated
 */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading…</div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="landing">
            <div className="landing-content">
              <h1>Task Management System</h1>
              <p>Organize your tasks efficiently with role-based access control.</p>
              <div className="landing-actions">
                <a href="/login" className="btn btn-primary">Sign In</a>
                <a href="/register" className="btn btn-secondary">Register</a>
              </div>
            </div>
          </div>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <TaskDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
