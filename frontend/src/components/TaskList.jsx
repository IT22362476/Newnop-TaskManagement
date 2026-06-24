/**
 * TaskList Component
 * Renders a table of tasks with role-aware actions.
 *
 * Admin sees: Created By + Assigned To columns, can edit/delete any task
 * User sees:  only their own + assigned tasks, can edit if owner/assignee, delete only if creator
 */
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

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

const TaskList = ({ onEdit }) => {
  const { user } = useAuth();
  const { tasks, loading, error, deleteTask, fetchTasks } = useTasks();
  const isAdmin = user?.role === 'admin';

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
            {isAdmin && <th>Created By</th>}
            {isAdmin && <th>Assigned To</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const isCreator = task.createdBy?._id === user?._id;
            const isAssignee = task.assignedTo?._id === user?._id;
            const canEdit = isAdmin || isCreator || isAssignee;
            const canDelete = isAdmin || isCreator;

            return (
              <tr key={task._id}>
                <td>
                  <strong>{task.title}</strong>
                  {task.description && <p className="task-desc">{task.description}</p>}
                </td>
                <td><span className={statusClass(task.status)}>{task.status}</span></td>
                <td><span className={priorityClass(task.priority)}>{task.priority}</span></td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</td>
                {isAdmin && <td>{task.createdBy?.name || 'Unknown'}</td>}
                {isAdmin && (
                  <td>
                    {task.assignedTo
                      ? `${task.assignedTo.name}`
                      : '—'}
                  </td>
                )}
                <td className="actions-cell">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => onEdit(task)}
                    disabled={!canEdit}
                    title={!canEdit ? 'You can only edit tasks you created or are assigned to' : ''}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(task._id)}
                    disabled={!canDelete}
                    title={!canDelete ? 'You can only delete tasks you created' : ''}
                  >
                    Delete
                  </button>
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
