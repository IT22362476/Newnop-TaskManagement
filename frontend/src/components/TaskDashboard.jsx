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

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  useEffect(() => {
    if (isAdmin) {
      getUsers().then(r => setUsers(r.data)).catch(e => console.error('Failed to load users:', e));
    }
  }, [isAdmin]);

  const handleLogout = useCallback(() => { logout(); navigate('/login'); }, [logout, navigate]);

  const openCreate = () => { setEditingTask(null); setShowForm(true); if (error) clearError(); };
  const openEdit = (task) => { setEditingTask(task); setShowForm(true); if (error) clearError(); };
  const closeForm = () => { setShowForm(false); setEditingTask(null); };

  const handleSubmit = async (data) => {
    if (editingTask) await updateTask(editingTask._id, data);
    else await createTask(data);
    closeForm();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="flex justify-between items-start flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isAdmin ? 'All Tasks' : 'My Tasks'}</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            Welcome, <strong className="text-gray-800">{user?.name}</strong>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${isAdmin ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'}`}>
              {user?.role}
            </span>
            {isAdmin && users.length > 0 && (
              <span className="text-gray-400 ml-1">{users.length} user{users.length !== 1 ? 's' : ''}</span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={openCreate} className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition">+ New Task</button>
          <button onClick={handleLogout} className="px-5 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition">Logout</button>
        </div>
      </header>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      <TaskList onEdit={openEdit} />

      {showForm && (
        <TaskForm initialData={editingTask} onSubmit={handleSubmit} onCancel={closeForm} userRole={user?.role} users={users} />
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
