import { useState, useEffect } from 'react';

const INITIAL_STATE = { title: '', description: '', status: 'pending', priority: 'medium', dueDate: '', assignedTo: '' };

const TaskForm = ({ initialData, onSubmit, onCancel, userRole, users }) => {
  const [form, setForm] = useState(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '', description: initialData.description || '',
        status: initialData.status || 'pending', priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate ? initialData.dueDate.slice(0, 10) : '',
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || '',
      });
    } else setForm(INITIAL_STATE);
  }, [initialData]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      const payload = { title: form.title, description: form.description, status: form.status, priority: form.priority, dueDate: form.dueDate || null };
      if (userRole === 'admin' && form.assignedTo) payload.assignedTo = form.assignedTo;
      await onSubmit(payload);
    } finally { setSubmitting(false); }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-900 mb-5">{initialData ? 'Edit Task' : 'New Task'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="tf-title" className={labelClass}>Title *</label>
            <input id="tf-title" name="title" value={form.title} onChange={handleChange} required className={inputClass} placeholder="Task title" />
          </div>
          <div className="mb-4">
            <label htmlFor="tf-description" className={labelClass}>Description</label>
            <textarea id="tf-description" name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} placeholder="Optional description" />
          </div>

          {userRole === 'admin' && users && (
            <div className="mb-4">
              <label htmlFor="tf-assignedTo" className={labelClass}>Assign To</label>
              <select id="tf-assignedTo" name="assignedTo" value={form.assignedTo} onChange={handleChange} className={inputClass}>
                <option value="">— Assign to myself —</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email}){u.role === 'admin' ? ' [Admin]' : ''}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label htmlFor="tf-status" className={labelClass}>Status</label>
              <select id="tf-status" name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="tf-priority" className={labelClass}>Priority</label>
              <select id="tf-priority" name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="tf-dueDate" className={labelClass}>Due Date</label>
              <input id="tf-dueDate" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onCancel} className="px-5 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition">Cancel</button>
            <button type="submit" disabled={submitting} className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition">
              {submitting ? 'Saving…' : initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
