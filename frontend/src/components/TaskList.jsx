import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

const badge = (variant, text) => {
  const map = {
    high: 'bg-red-100 text-red-800', danger: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800', warning: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800', info: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800', success: 'bg-green-100 text-green-800',
    'in-progress': 'bg-indigo-100 text-indigo-800', primary: 'bg-indigo-100 text-indigo-800',
    pending: 'bg-gray-100 text-gray-800', secondary: 'bg-gray-100 text-gray-800',
  };
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[variant] || map.secondary}`}>{text}</span>;
};

const TaskList = ({ onEdit }) => {
  const { user } = useAuth();
  const { tasks, loading, error, deleteTask, fetchTasks } = useTasks();
  const isAdmin = user?.role === 'admin';

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try { await deleteTask(id); } catch { /* error shown in context */ }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading tasks…</div>;

  if (error) return (
    <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm flex items-center justify-between">
      <span>{error}</span>
      <button onClick={fetchTasks} className="ml-3 px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300">Retry</button>
    </div>
  );

  if (tasks.length === 0) return <div className="text-center py-16 text-gray-400">No tasks yet. Create one above!</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Due Date</th>
            {isAdmin && <th className="px-4 py-3">Created By</th>}
            {isAdmin && <th className="px-4 py-3">Assigned To</th>}
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tasks.map(task => {
            const isCreator = task.createdBy?._id === user?._id;
            const isAssignee = task.assignedTo?._id === user?._id;
            const canEdit = isAdmin || isCreator || isAssignee;
            const canDelete = isAdmin || isCreator;

            return (
              <tr key={task._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <strong className="text-gray-900">{task.title}</strong>
                  {task.description && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{task.description}</p>}
                </td>
                <td className="px-4 py-3">{badge(task.status, task.status)}</td>
                <td className="px-4 py-3">{badge(task.priority, task.priority)}</td>
                <td className="px-4 py-3 text-gray-600">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</td>
                {isAdmin && <td className="px-4 py-3 text-gray-700">{task.createdBy?.name || 'Unknown'}</td>}
                {isAdmin && <td className="px-4 py-3 text-gray-700">{task.assignedTo?.name || '—'}</td>}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(task)} disabled={!canEdit}
                      className="px-3 py-1 text-xs font-medium rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      title={!canEdit ? 'You can only edit tasks you created or are assigned to' : ''}>Edit</button>
                    <button onClick={() => handleDelete(task._id)} disabled={!canDelete}
                      className="px-3 py-1 text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      title={!canDelete ? 'You can only delete tasks you created' : ''}>Delete</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
