/**
 * TaskList Component
 * Renders a table/list of tasks with edit and delete actions.
 */
import { useTasks } from '../context/TaskContext';

const priorityClass = (p) => {
  if (p === 'high') return 'badge badge-danger';
  if (p === 'medium') return 'badge badge-warning';
  return 'badge badge-info';
};

const statusClass = (s) => {
  if (s === 'completed') return 'badge badge-success';
  if (s === 'in-progress') return 'badge badge-primary';
  return 'badge badge-secondary';
};

const TaskList = ({ onEdit, userRole }) => {
  const { tasks, loading, error, deleteTask, fetchTasks } = useTasks();

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
    } catch {
      // error shown in context
    }
  };

  if (loading) return <div className="loading">Loading tasks…</div>;
  if (error) {
    return (
      <div className="alert alert-error">
        {error}
        <button className="btn btn-sm btn-secondary" onClick={fetchTasks} style={{ marginLeft: 12 }}>
          Retry
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return <div className="empty-state">No tasks yet. Create one above!</div>;
  }

  return (
    <div className="task-table-wrapper">
      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            {userRole === 'admin' && <th>Owner</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>
                <strong>{task.title}</strong>
                {task.description && <p className="task-desc">{task.description}</p>}
              </td>
              <td><span className={statusClass(task.status)}>{task.status}</span></td>
              <td><span className={priorityClass(task.priority)}>{task.priority}</span></td>
              <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</td>
              {userRole === 'admin' && <td>{task.user?.name || 'Unknown'}</td>}
              <td className="actions-cell">
                <button className="btn btn-sm btn-secondary" onClick={() => onEdit(task)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
