/**
 * TaskContext — Manages task data globally.
 * Provides: tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask
 */
import { createContext, useContext, useState, useCallback } from 'react';
import * as api from '../services/api';

const TaskContext = createContext(null);

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.getTasks();
      setTasks(data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch tasks';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    setError(null);
    try {
      const { data } = await api.createTask(taskData);
      setTasks((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create task';
      setError(msg);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id, taskData) => {
    setError(null);
    try {
      const { data } = await api.updateTask(id, taskData);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task';
      setError(msg);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    setError(null);
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete task';
      setError(msg);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <TaskContext.Provider value={{ tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, clearError }}>
      {children}
    </TaskContext.Provider>
  );
};
