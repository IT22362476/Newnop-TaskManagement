/**
 * TaskDashboard Component
 * Main dashboard page after login. Shows task list, create/edit modals.
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks, TaskProvider } from '../context/TaskContext';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const DashboardInner = () => {
  const { user, logout } = useAuth();
  const { fetchTasks, createTask, updateTask, error, clearError } = useTasks();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
          <h1>Task Manager</h1>
          <p className="user-info">
            Welcome, <strong>{user?.name}</strong>
            <span className={`badge ${user?.role === 'admin' ? 'badge-primary' : 'badge-info'}`}>
              {user?.role}
            </span>
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
      <TaskList onEdit={openEdit} userRole={user?.role} />

      {/* Create/Edit Modal */}
      {showForm && (
        <TaskForm
          initialData={editingTask}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}
    </div>
  );
};

/**
 * Wraps DashboardInner in TaskProvider so the dashboard
 * has its own task state. If you need tasks accessible
 * outside the dashboard, move TaskProvider higher in the tree.
 */
const TaskDashboard = () => (
  <TaskProvider>
    <DashboardInner />
  </TaskProvider>
);

export default TaskDashboard;
