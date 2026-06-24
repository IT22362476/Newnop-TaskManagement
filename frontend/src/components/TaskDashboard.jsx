/**
 * TaskDashboard Component
 * Main dashboard page after login. Role-aware:
 *   Admin — "All Tasks" header, can assign tasks to any user
 *   User  — "My Tasks" header, tasks auto-assigned to self
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks, TaskProvider } from '../context/TaskContext';
import { getUsers } from '../services/api';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const DashboardInner = () => {
  const { user, logout } = useAuth();
  const { fetchTasks, createTask, updateTask, error, clearError } = useTasks();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [users, setUsers] = useState([]);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Admin: fetch all users for assignment dropdown
  useEffect(() => {
    if (isAdmin) {
      getUsers()
        .then((res) => setUsers(res.data))
        .catch((err) => console.error('Failed to load users:', err));
    }
  }, [isAdmin]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const openCreate = () => {
    setEditingTask(null);
    setShowForm(true);
    if (error) clearError();
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
    if (error) clearError();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleSubmit = async (data) => {
    if (editingTask) {
      await updateTask(editingTask._id, data);
    } else {
      await createTask(data);
    }
    closeForm();
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>{isAdmin ? 'All Tasks' : 'My Tasks'}</h1>
          <p className="user-info">
            Welcome, <strong>{user?.name}</strong>
            <span className={`badge ${isAdmin ? 'badge-primary' : 'badge-info'}`}>
              {user?.role}
            </span>
            {isAdmin && users.length > 0 && (
              <span className="user-count">{users.length} user{users.length !== 1 ? 's' : ''} in system</span>
            )}
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openCreate}>
            + New Task
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Error Banner */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Task List */}
      <TaskList onEdit={openEdit} />

      {/* Create/Edit Modal */}
      {showForm && (
        <TaskForm
          initialData={editingTask}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          userRole={user?.role}
          users={users}
        />
      )}
    </div>
  );
};

const TaskDashboard = () => (
  <TaskProvider>
    <DashboardInner />
  </TaskProvider>
);

export default TaskDashboard;
