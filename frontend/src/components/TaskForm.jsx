/**
 * TaskForm Component
 * Modal / inline form for creating or editing a task.
 */
import { useState, useEffect } from 'react';

const INITIAL_STATE = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
};

const TaskForm = ({ initialData, onSubmit, onCancel }) => {
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
      });
    } else {
      setForm(INITIAL_STATE);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        dueDate: form.dueDate || null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{initialData ? 'Edit Task' : 'New Task'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tf-title">Title *</label>
            <input
              id="tf-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Task title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="tf-description">Description</label>
            <textarea
              id="tf-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Optional description"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tf-status">Status</label>
              <select id="tf-status" name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tf-priority">Priority</label>
              <select id="tf-priority" name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tf-dueDate">Due Date</label>
              <input
                id="tf-dueDate"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
