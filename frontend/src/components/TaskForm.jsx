import { useState, useEffect } from 'react';

const todayStr = new Date().toISOString().split('T')[0];

const INITIAL_STATE = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
  assignedTo: '',
};

const TaskForm = ({ initialData, onSubmit, onCancel, userRole, users }) => {
  const [form, setForm] = useState(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate ? initialData.dueDate.slice(0, 10) : '',
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || '',
      });
    } else {
      setForm(INITIAL_STATE);
    }
  }, [initialData]);

  // Don't allow priority/dueDate changes when a regular user edits an admin's task
  const isRestricted =
    userRole === 'user' &&
    initialData?.createdBy?.role === 'admin';


  const handleChange = (e) => {
    if (isRestricted && (e.target.name === 'priority' || e.target.name === 'dueDate')) return;
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate || null,
      };
      if (userRole === 'admin' && form.assignedTo) payload.assignedTo = form.assignedTo;
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition';
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            {initialData ? 'Edit Task' : 'New Task'}
          </h3>
          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="tf-title" className={labelClass}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="tf-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              autoFocus
              className={inputClass}
              placeholder="Task title"
            />
          </div>

          <div>
            <label htmlFor="tf-description" className={labelClass}>
              Description
            </label>
            <textarea
              id="tf-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Optional description"
            />
          </div>

          {userRole === 'admin' && users && (
            <div>
              <label htmlFor="tf-assignedTo" className={labelClass}>
                Assign To
              </label>
              <select
                id="tf-assignedTo"
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">— Assign to myself —</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email}){u.role === 'admin' ? ' [Admin]' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="tf-status" className={labelClass}>
                Status
              </label>
              <select
                id="tf-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="tf-priority" className={labelClass}>
                Priority
              </label>
              <select
                id="tf-priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                disabled={isRestricted}
                className={inputClass + (isRestricted ? " bg-gray-100 cursor-not-allowed" : "")}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label htmlFor="tf-dueDate" className={labelClass}>
                Due Date
              </label>
              <input
                id="tf-dueDate"
                name="dueDate"
                type="date"
                min={todayStr}
                value={form.dueDate}
                onChange={handleChange}
                disabled={isRestricted}
                className={inputClass + (isRestricted ? " bg-gray-100 cursor-not-allowed" : "")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {submitting ? 'Saving…' : initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
