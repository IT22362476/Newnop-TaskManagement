import Swal from 'sweetalert2';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-slate-100 text-slate-600' },
  'in-progress': { label: 'In Progress', className: 'bg-indigo-100 text-indigo-700' },
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-700' },
};

const priorityConfig = {
  low: { label: 'Low', className: 'bg-blue-100 text-blue-700' },
  medium: { label: 'Medium', className: 'bg-amber-100 text-amber-700' },
  high: { label: 'High', className: 'bg-red-100 text-red-700' },
};

const Badge = ({ config, fallback }) => {
  const cfg = config || { label: fallback, className: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
};

const TaskList = ({ onEdit }) => {
  const { user } = useAuth();
  const { tasks, loading, error, deleteTask, fetchTasks } = useTasks();
  const isAdmin = user?.role === 'admin';

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({ title: 'Delete task?', text: 'Are you sure you want to delete this task?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Delete', cancelButtonText: 'Cancel' }); if (!confirmDelete.isConfirmed) return;
    try {
      await deleteTask(id);
    } catch {
      /* error shown in context */
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
        <span className="text-sm font-medium">Loading tasks…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-slate-600 mb-4">{error}</p>
        <button
          onClick={fetchTasks}
          className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-700">No tasks yet</h3>
        <p className="text-sm text-slate-400 mt-1">Create a new task to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-5 py-3.5">Title</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Priority</th>
              <th className="px-5 py-3.5">Due Date</th>
              {isAdmin && <th className="px-5 py-3.5">Created By</th>}
              {isAdmin && <th className="px-5 py-3.5">Assigned To</th>}
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const isCreator = task.createdBy?._id === user?._id;
              const isAssignee = task.assignedTo?._id === user?._id;
              const canEdit = isAdmin || isCreator || isAssignee;
              const canDelete = isAdmin || isCreator;

              return (
                <tr key={task._id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-900">{task.title}</div>
                    {task.description && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{task.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <Badge config={statusConfig[task.status]} fallback={task.status} />
                  </td>
                  <td className="px-5 py-4">
                    <Badge config={priorityConfig[task.priority]} fallback={task.priority} />
                  </td>
                  <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </td>
                  {isAdmin && <td className="px-5 py-4 text-slate-700">{task.createdBy?.name || 'Unknown'}</td>}
                  {isAdmin && <td className="px-5 py-4 text-slate-700">{task.assignedTo?.name || '—'}</td>}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(task)}
                        disabled={!canEdit}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        title={!canEdit ? 'You can only edit tasks you created or are assigned to' : 'Edit task'}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        disabled={!canDelete}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        title={!canDelete ? 'You can only delete tasks you created' : 'Delete task'}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
